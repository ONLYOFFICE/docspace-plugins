import JSZip from "jszip";
import { initFb2File } from "@lingo-reader/fb2-parser";
import {
  getBookmark,
  saveBookmark,
  cleanupOldBookmarks,
} from "../utils/bookmarks";
import { generateSpreadHTML } from "../templates/spread";
import { writeToIframe, makeIframeBody } from "../utils/iframe";

interface Fb2Book {
  title: string;
  chapters: Array<{ title: string; html: string }>;
}

async function loadFb2(blob: Blob): Promise<Fb2Book> {
  const file = new File([blob], "book.fb2", { type: "text/xml" });
  const fb2Book = await initFb2File(file);
  const spine = fb2Book.getSpine();
  const metadata = fb2Book.getMetadata();

  const title = metadata?.title || "Untitled";
  const chapters = spine.map((item: any) => {
    const chapter = fb2Book.loadChapter(item.id);
    return {
      title: item.title || "Chapter",
      html: chapter?.html || "",
    };
  });

  return { title, chapters };
}

function renderFb2Chapter(
  fb2: Fb2Book,
  index: number,
  scrollTop: number = 0,
): string {
  const total = fb2.chapters.length;
  const content = fb2.chapters[index]?.html || "";

  const prevIndex = index - 1;
  const nextIndex = index + 1;

  return generateSpreadHTML({
    content,
    currentPage: index + 1,
    totalPages: total,
    onPrevious: index > 0 ? `__fb2GoTo(${prevIndex})` : "",
    onNext: index < total - 1 ? `__fb2GoTo(${nextIndex})` : "",
    hasNext: index < total - 1,
    hasPrevious: index > 0,
    scrollTop,
    onScroll: "__fb2OnScroll",
  });
}

export async function handleFb2(fileInfo: any): Promise<any> {
  const res = await fetch(fileInfo.viewUrl);
  const blob = await res.blob();
  const fb2 = await loadFb2(blob);

  cleanupOldBookmarks();
  const bookmark = getBookmark(fileInfo.id);
  let currentIndex = 0;
  let currentScrollTop = 0;

  if (bookmark && bookmark.currentIndex < fb2.chapters.length) {
    currentIndex = bookmark.currentIndex;
    currentScrollTop = bookmark.scrollTop || 0;
  }

  const goTo = (index: number, scrollTop: number = 0) => {
    if (index < 0 || index >= fb2.chapters.length) return;
    currentIndex = index;
    currentScrollTop = scrollTop;

    saveBookmark(
      fileInfo.id,
      fileInfo.title,
      currentIndex,
      fb2.chapters.length,
      currentScrollTop,
    );

    const html = renderFb2Chapter(fb2, currentIndex, scrollTop);
    writeToIframe("fb2-reader-frame", html, (iframeWin) => {
      (iframeWin as any).__fb2GoTo = (idx: number) => goTo(idx, 0);
      (iframeWin as any).__fb2OnScroll = (st: number) => {
        currentScrollTop = st;
        saveBookmark(
          fileInfo.id,
          fileInfo.title,
          currentIndex,
          fb2.chapters.length,
          st,
        );
      };
    });
  };

  const body = makeIframeBody("fb2-reader-frame");
  setTimeout(() => goTo(currentIndex, currentScrollTop), 200);

  return { newDialogHeader: fb2.title || fileInfo.title, newDialogBody: body };
}

export async function handleFb2Zip(fileInfo: any): Promise<any> {
  const res = await fetch(fileInfo.viewUrl);
  const arrayBuffer = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const fb2Entry = Object.values(zip.files).find(
    (f) => !f.dir && f.name.toLowerCase().endsWith(".fb2"),
  );
  if (!fb2Entry) {
    throw new Error("No .fb2 file found in ZIP");
  }

  const fb2Buffer = await fb2Entry.async("arraybuffer");
  const blob = new Blob([fb2Buffer], { type: "text/xml" });
  const fb2 = await loadFb2(blob);

  cleanupOldBookmarks();
  const bookmark = getBookmark(fileInfo.id);
  let currentIndex = 0;
  let currentScrollTop = 0;

  if (bookmark && bookmark.currentIndex < fb2.chapters.length) {
    currentIndex = bookmark.currentIndex;
    currentScrollTop = bookmark.scrollTop || 0;
  }

  const goTo = (index: number, scrollTop: number = 0) => {
    if (index < 0 || index >= fb2.chapters.length) return;
    currentIndex = index;
    currentScrollTop = scrollTop;

    saveBookmark(
      fileInfo.id,
      fileInfo.title,
      currentIndex,
      fb2.chapters.length,
      currentScrollTop,
    );

    const html = renderFb2Chapter(fb2, currentIndex, scrollTop);
    writeToIframe("fb2-reader-frame", html, (iframeWin) => {
      (iframeWin as any).__fb2GoTo = (idx: number) => goTo(idx, 0);
      (iframeWin as any).__fb2OnScroll = (st: number) => {
        currentScrollTop = st;
        saveBookmark(
          fileInfo.id,
          fileInfo.title,
          currentIndex,
          fb2.chapters.length,
          st,
        );
      };
    });
  };

  const body = makeIframeBody("fb2-reader-frame");
  setTimeout(() => goTo(currentIndex, currentScrollTop), 200);

  return { newDialogHeader: fb2.title || fileInfo.title, newDialogBody: body };
}
