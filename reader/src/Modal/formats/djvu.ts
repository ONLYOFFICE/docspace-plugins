import DjVu from "djvujs-dist/library/src/index.js";
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

export async function handleDjvu(fileInfo: any): Promise<any> {
  const body = makeIframeBody("djvu-reader-frame");

  setTimeout(async () => {
    const res = await fetch(fileInfo.viewUrl);
    const djvuBuf = await res.arrayBuffer();
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
