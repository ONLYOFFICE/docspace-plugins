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

function renderDjvuSpread(
  src: string,
  index: number,
  total: number,
  scrollTop: number = 0,
): string {
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
    scrollTop,
    onScroll: "__djvuOnScroll",
  });
}

export async function handleZip(fileInfo: any): Promise<any> {
  const res = await fetch(fileInfo.viewUrl);
  const arrayBuffer = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const epubEntries = Object.values(zip.files).filter(
    (f) => !f.dir && f.name.toLowerCase().endsWith(".epub"),
  );
  const fb2Entries = Object.values(zip.files).filter(
    (f) => !f.dir && f.name.toLowerCase().endsWith(".fb2"),
  );
  const djvuEntries = Object.values(zip.files).filter(
    (f) =>
      !f.dir &&
      (f.name.toLowerCase().endsWith(".djvu") ||
        f.name.toLowerCase().endsWith(".djv")),
  );
  const containerEntry = zip.file(/^meta-inf\/container\.xml$/i)[0];

  const totalBookFiles =
    epubEntries.length +
    fb2Entries.length +
    djvuEntries.length +
    (containerEntry ? 1 : 0);

  if (totalBookFiles === 0) {
    throw new Error("ZIP does not contain a recognised book format.");
  }

  if (totalBookFiles > 1) {
    throw new Error(
      "ZIP contains multiple book files. Please extract and open individually.",
    );
  }

  // Case 1: Single .epub file inside
  if (epubEntries.length === 1) {
    const epubBuffer = await epubEntries[0].async("arraybuffer");
    const epub = await loadEpub(epubBuffer);

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

    return {
      newDialogHeader: epub.title || fileInfo.title,
      newDialogBody: body,
    };
  }

  // Case 2: Raw EPUB structure (META-INF/container.xml)
  if (containerEntry) {
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

    return {
      newDialogHeader: epub.title || fileInfo.title,
      newDialogBody: body,
    };
  }

  // Case 3: Single .fb2 file inside
  if (fb2Entries.length === 1) {
    return handleFb2Zip(fileInfo);
  }

  // Case 4: Single .djvu or .djv file inside
  if (djvuEntries.length === 1) {
    const body = makeIframeBody("djvu-reader-frame");

    setTimeout(async () => {
      const djvuBuf = await djvuEntries[0].async("arraybuffer");
      const doc = new DjVu.Document(djvuBuf);
      const total = doc.getPagesQuantity();

      cleanupOldBookmarks();
      const bookmark = getBookmark(fileInfo.id);
      let currentIndex = 0;
      let currentScrollTop = 0;

      if (bookmark && bookmark.currentIndex < total) {
        currentIndex = bookmark.currentIndex;
        currentScrollTop = bookmark.scrollTop || 0;
      }

      const goTo = async (index: number, scrollTop: number = 0) => {
        if (index < 0 || index >= total) return;
        currentIndex = index;
        currentScrollTop = scrollTop;

        saveBookmark(
          fileInfo.id,
          fileInfo.title,
          currentIndex,
          total,
          currentScrollTop,
        );

        const src = await renderDjvuPage(doc, currentIndex + 1);
        const html = renderDjvuSpread(src, currentIndex, total, scrollTop);

        writeToIframe("djvu-reader-frame", html, (iframeWin) => {
          (iframeWin as any).__djvuGoTo = (idx: number) => goTo(idx, 0);
          (iframeWin as any).__djvuOnScroll = (st: number) => {
            currentScrollTop = st;
            saveBookmark(fileInfo.id, fileInfo.title, currentIndex, total, st);
          };
        });
      };

      goTo(currentIndex, currentScrollTop);
    }, 200);

    return { newDialogHeader: fileInfo.title, newDialogBody: body };
  }
}
