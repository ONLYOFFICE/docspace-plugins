import JSZip from "jszip";
import DjVu from "djvujs-dist/library/src/index.js";
import { loadEpub, renderEpubChapter } from "./epub";
import { handleFb2Zip } from "./fb2";
import {
  getBookmark,
  saveBookmark,
  cleanupOldBookmarks,
} from "../utils/bookmarks";
import { generateSpreadHTML } from "../templates/spread";
import { writeToIframe, makeIframeBody } from "../utils/iframe";

// ZIP Content Detection

async function renderDjvuPage(doc: any, pageNum: number): Promise<string> {
  const page = await doc.getPage(pageNum);
  const imageData = page.getImageData();
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
  ctx.putImageData(imageData, 0, 0);
  const blob = await (canvas as any).convertToBlob({ type: "image/png" });

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function renderDjvuSpread(src: string, index: number, total: number): string {
  const content = src
    ? `<div class="page-panel"><img src="${src}" style="max-width:100%;max-height:calc(90vh - 96px);display:block;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,.18)"></div>`
    : "";

  const prevIndex = index - 1;
  const nextIndex = index + 1;

  return generateSpreadHTML({
    content,
    currentPage: index + 1,
    totalPages: total,
    onPrevious: index > 0 ? `__djvuGoTo(${prevIndex})` : "",
    onNext: index < total - 1 ? `__djvuGoTo(${nextIndex})` : "",
    hasNext: index < total - 1,
    hasPrevious: index > 0,
  });
}

export async function handleZip(fileInfo: any): Promise<any> {
  const res = await fetch(fileInfo.viewUrl);
  const arrayBuffer = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Case 1: Single .epub file inside
  const epubEntry = Object.values(zip.files).find(
    (f) => !f.dir && f.name.toLowerCase().endsWith(".epub"),
  );
  if (epubEntry) {
    const epubBuffer = await epubEntry.async("arraybuffer");
    const epub = await loadEpub(epubBuffer);

    cleanupOldBookmarks();
    const bookmark = getBookmark(fileInfo.id);
    let currentIndex = 0;

    if (bookmark && bookmark.currentIndex < epub.spine.length) {
      currentIndex = bookmark.currentIndex;
    }

    const goTo = (index: number) => {
      if (index < 0 || index >= epub.spine.length) return;
      currentIndex = index;
      saveBookmark(
        fileInfo.id,
        fileInfo.title,
        currentIndex,
        epub.spine.length,
      );
      const html = renderEpubChapter(epub, currentIndex);
      writeToIframe("epub-reader-frame", html, (iframeWin) => {
        (iframeWin as any).__epubGoTo = goTo;
      });
    };

    const body = makeIframeBody("epub-reader-frame");
    setTimeout(() => goTo(currentIndex), 200);

    return {
      newDialogHeader: epub.title || fileInfo.title,
      newDialogBody: body,
    };
  }

  // Case 2: Raw EPUB structure (META-INF/container.xml)
  const containerEntry = zip.file(/^meta-inf\/container\.xml$/i)[0];
  if (containerEntry) {
    const epub = await loadEpub(arrayBuffer);

    cleanupOldBookmarks();
    const bookmark = getBookmark(fileInfo.id);
    let currentIndex = 0;

    if (bookmark && bookmark.currentIndex < epub.spine.length) {
      currentIndex = bookmark.currentIndex;
    }

    const goTo = (index: number) => {
      if (index < 0 || index >= epub.spine.length) return;
      currentIndex = index;
      saveBookmark(
        fileInfo.id,
        fileInfo.title,
        currentIndex,
        epub.spine.length,
      );
      const html = renderEpubChapter(epub, currentIndex);
      writeToIframe("epub-reader-frame", html, (iframeWin) => {
        (iframeWin as any).__epubGoTo = goTo;
      });
    };

    const body = makeIframeBody("epub-reader-frame");
    setTimeout(() => goTo(currentIndex), 200);

    return {
      newDialogHeader: epub.title || fileInfo.title,
      newDialogBody: body,
    };
  }

  // Case 3: Single .fb2 file inside
  const fb2Entry = Object.values(zip.files).find(
    (f) => !f.dir && f.name.toLowerCase().endsWith(".fb2"),
  );
  if (fb2Entry) {
    return handleFb2Zip(fileInfo);
  }

  // Case 4: Single .djvu or .djv file inside
  const djvuEntry = Object.values(zip.files).find(
    (f) =>
      !f.dir &&
      (f.name.toLowerCase().endsWith(".djvu") ||
        f.name.toLowerCase().endsWith(".djv")),
  );
  if (djvuEntry) {
    const body = makeIframeBody("djvu-reader-frame");

    setTimeout(async () => {
      const djvuBuf = await djvuEntry.async("arraybuffer");
      const doc = new DjVu.Document(djvuBuf);
      const total = doc.getPagesQuantity();

      cleanupOldBookmarks();
      const bookmark = getBookmark(fileInfo.id);
      let currentIndex = 0;

      if (bookmark && bookmark.currentIndex < total) {
        currentIndex = bookmark.currentIndex;
      }

      const goTo = async (index: number) => {
        if (index < 0 || index >= total) return;
        currentIndex = index;

        saveBookmark(fileInfo.id, fileInfo.title, currentIndex, total);

        // DjVu pages are 1-indexed, not 0-indexed
        const src = await renderDjvuPage(doc, currentIndex + 1);

        const html = renderDjvuSpread(src, currentIndex, total);

        writeToIframe("djvu-reader-frame", html, (iframeWin) => {
          (iframeWin as any).__djvuGoTo = goTo;
        });
      };

      goTo(currentIndex);
    }, 200);

    return { newDialogHeader: fileInfo.title, newDialogBody: body };
  }

  // Unknown ZIP content
  throw new Error(
    "This ZIP does not contain a recognised book format. Supported: EPUB (with META-INF/container.xml), .fb2, or .djvu inside a ZIP.",
  );
}
