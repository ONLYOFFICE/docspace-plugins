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

  const parser = new DOMParser();
  const opfDoc = parser.parseFromString(opfText, "application/xml");

  const titleEl = opfDoc.getElementsByTagNameNS("*", "title")[0];
  const title = titleEl?.textContent?.trim() || "Untitled";

  const manifest: Record<string, string> = {};
  const itemEls = opfDoc.getElementsByTagNameNS("*", "item");
  for (let i = 0; i < itemEls.length; i++) {
    const id = itemEls[i].getAttribute("id");
    const href = itemEls[i].getAttribute("href");
    if (id && href) manifest[id] = href;
  }

  const spine: Array<{ id: string; href: string }> = [];
  const itemrefEls = opfDoc.getElementsByTagNameNS("*", "itemref");
  for (let i = 0; i < itemrefEls.length; i++) {
    const idref = itemrefEls[i].getAttribute("idref");
    if (!idref) continue;
    const relHref = manifest[idref];
    if (relHref)
      spine.push({
        id: idref,
        href: opfDir ? `${opfDir}/${relHref}` : relHref,
      });
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

  const rawCss = collectedCss.join("\n") + "\n" + existingStyles.join("\n");
  const scopedCss = rawCss
    .replace(/\bhtml\b/g, "#spread-container")
    .replace(/\bbody\b/g, "#spread-container")
    .replace(/@page[^{]*\{[^}]*\}/g, "")
    .replace(/@font-face/g, "@font-face");

  return `<style>${scopedCss}</style>${bodyContent}`;
}

export function renderEpubChapter(
  epub: EpubBook,
  index: number,
  scrollTop: number = 0,
): string {
  const total = epub.spine.length;
  const content = extractPage(epub, index);

  return generateSpreadHTML({
    content,
    currentPage: index + 1,
    totalPages: total,
    hasNext: index < total - 1,
    hasPrevious: index > 0,
    scrollTop,
    onScroll: "__epubOnScroll",
    onPrevious: index > 0 ? `__epubGoTo(${index - 1})` : "",
    onNext: index < total - 1 ? `__epubGoTo(${index + 1})` : "",
  });
}

export async function handleEpub(fileInfo: any): Promise<any> {
  const arrayBuffer =
    (fileInfo as any)._zipBuffer instanceof ArrayBuffer
      ? (fileInfo as any)._zipBuffer
      : await (await fetch(fileInfo.viewUrl)).arrayBuffer();

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

    const html = renderEpubChapter(epub, currentIndex, scrollTop);
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

  setTimeout(() => goTo(currentIndex, currentScrollTop), 50);

  return { newDialogHeader: epub.title || fileInfo.title, newDialogBody: body };
}
