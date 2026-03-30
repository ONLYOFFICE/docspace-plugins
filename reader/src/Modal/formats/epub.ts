import JSZip from "jszip";
import {
  arrayBufferToBase64,
  mimeFromExt,
  resolvePath,
} from "../utils/helpers";
import {
  getBookmark,
  saveBookmark,
  cleanupOldBookmarks,
} from "../utils/bookmarks";
import { generateSpreadHTML } from "../templates/spread";
import { writeToIframe, makeIframeBody } from "../utils/iframe";

interface EpubBook {
  title: string;
  spine: Array<{ id: string; href: string }>;
  manifest: Record<string, string>;
  assets: Record<string, string>;
  htmlFiles: Record<string, string>;
  cssFiles: Record<string, string>;
}

export async function loadEpub(arrayBuffer: ArrayBuffer): Promise<EpubBook> {
  const zip = await JSZip.loadAsync(arrayBuffer);

  const containerEntry = zip.file(/^meta-inf\/container\.xml$/i)[0];
  const containerXml = await containerEntry?.async("text");
  if (!containerXml) throw new Error("Missing META-INF/container.xml");

  const rootfileMatch = containerXml.match(/full-path="([^"]+)"/);
  if (!rootfileMatch) throw new Error("Could not find rootfile");

  const opfPath = rootfileMatch[1];
  const opfDir = opfPath.includes("/")
    ? opfPath.split("/").slice(0, -1).join("/")
    : "";

  const opfText = await zip.file(opfPath)?.async("text");
  if (!opfText) throw new Error("Could not read OPF: " + opfPath);

  const titleMatch = opfText.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i);
  const title = titleMatch ? titleMatch[1] : "Untitled";

  const manifest: Record<string, string> = {};
  const itemRegex = /<item\s+id="([^"]+)"\s+href="([^"]+)"/g;
  let m;
  while ((m = itemRegex.exec(opfText)) !== null) {
    manifest[m[1]] = m[2];
  }

  const spine: Array<{ id: string; href: string }> = [];
  const spineRegex = /<itemref\s+idref="([^"]+)"/g;
  while ((m = spineRegex.exec(opfText)) !== null) {
    const relHref = manifest[m[1]];
    if (relHref)
      spine.push({ id: m[1], href: opfDir ? `${opfDir}/${relHref}` : relHref });
  }

  const assets: Record<string, string> = {};
  const htmlFiles: Record<string, string> = {};
  const cssFiles: Record<string, string> = {};
  const promises: Promise<void>[] = [];

  zip.forEach((relativePath, entry) => {
    if (entry.dir) return;
    const lower = relativePath.toLowerCase();
    if (
      [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
        ".woff",
        ".woff2",
        ".ttf",
        ".otf",
      ].some((e) => lower.endsWith(e))
    ) {
      promises.push(
        entry.async("arraybuffer").then((buf) => {
          assets[relativePath] = `data:${mimeFromExt(
            relativePath,
          )};base64,${arrayBufferToBase64(buf)}`;
        }),
      );
    } else if ([".xhtml", ".html", ".htm"].some((e) => lower.endsWith(e))) {
      promises.push(
        entry.async("text").then((text) => {
          htmlFiles[relativePath] = text;
        }),
      );
    } else if (lower.endsWith(".css")) {
      promises.push(
        entry.async("text").then((text) => {
          cssFiles[relativePath] = text;
        }),
      );
    }
  });

  await Promise.all(promises);

  return { title, spine, manifest, assets, htmlFiles, cssFiles };
}

export function extractPage(epub: EpubBook, index: number): string {
  if (index < 0 || index >= epub.spine.length) return "";
  const item = epub.spine[index];
  const rawHtml = epub.htmlFiles[item.href] ?? "<p></p>";

  const collectedCss: string[] = [];
  const linkRegex =
    /<link\b[^>]*\brel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let lm: RegExpExecArray | null;
  while ((lm = linkRegex.exec(rawHtml)) !== null) {
    const val = lm[1];
    if (!val.startsWith("http") && !val.startsWith("data:")) {
      const resolved = resolvePath(item.href, val);
      if (epub.cssFiles[resolved]) collectedCss.push(epub.cssFiles[resolved]);
    }
  }

  const inlined = rawHtml
    .replace(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi, "")
    .replace(/(src|href)=(['"])([^'"]+)\2/gi, (_m, attr, quote, val) => {
      if (
        val.startsWith("http") ||
        val.startsWith("data:") ||
        val.startsWith("#")
      )
        return `${attr}=${quote}${val}${quote}`;
      const resolved = resolvePath(item.href, val);
      if (epub.assets[resolved])
        return `${attr}=${quote}${epub.assets[resolved]}${quote}`;
      return `${attr}=${quote}${val}${quote}`;
    });

  const bodyMatch = inlined.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : inlined;

  const existingStyles: string[] = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sm: RegExpExecArray | null;
  while ((sm = styleRegex.exec(inlined)) !== null) existingStyles.push(sm[1]);

  return `<style>${collectedCss.join("\n")}\n${existingStyles.join(
    "\n",
  )}</style>${bodyContent}`;
}

export function renderEpubChapter(
  epub: EpubBook,
  index: number,
  scrollTop: number = 0,
  onScroll: string = "",
): string {
  const total = epub.spine.length;
  const content = extractPage(epub, index);

  const prevIndex = index - 1;
  const nextIndex = index + 1;

  return generateSpreadHTML({
    content,
    currentPage: index + 1,
    totalPages: total,
    onPrevious: index > 0 ? `__epubGoTo(${prevIndex})` : "",
    onNext: index < total - 1 ? `__epubGoTo(${nextIndex})` : "",
    hasNext: index < total - 1,
    hasPrevious: index > 0,
    scrollTop,
    onScroll,
  });
}

export async function handleEpub(fileInfo: any): Promise<any> {
  const res = await fetch(fileInfo.viewUrl);
  const arrayBuffer = await res.arrayBuffer();
  const epub = await loadEpub(arrayBuffer);

  cleanupOldBookmarks();
  const bookmark = getBookmark(fileInfo.id);
  let currentIndex = 0;
  let currentScrollTop = 0;

  if (bookmark && bookmark.currentIndex < epub.spine.length) {
    currentIndex = bookmark.currentIndex;
    currentScrollTop = bookmark.scrollTop || 0;
  }

  const goTo = (index: number, scrollTop: number = 0) => {
    if (index < 0 || index >= epub.spine.length) return;
    currentIndex = index;
    currentScrollTop = scrollTop;

    saveBookmark(
      fileInfo.id,
      fileInfo.title,
      currentIndex,
      epub.spine.length,
      currentScrollTop,
    );

    const html = renderEpubChapter(
      epub,
      currentIndex,
      scrollTop,
      "__epubOnScroll",
    );
    writeToIframe("epub-reader-frame", html, (iframeWin) => {
      (iframeWin as any).__epubGoTo = (idx: number) => goTo(idx, 0);
      (iframeWin as any).__epubOnScroll = (st: number) => {
        currentScrollTop = st;
        saveBookmark(
          fileInfo.id,
          fileInfo.title,
          currentIndex,
          epub.spine.length,
          st,
        );
      };
    });
  };

  const body = makeIframeBody("epub-reader-frame");
  setTimeout(() => goTo(currentIndex, currentScrollTop), 200);

  return { newDialogHeader: epub.title || fileInfo.title, newDialogBody: body };
}
