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

// The fb2-parser internally calls URL.createObjectURL() for images.
// Blob URLs are CSP-blocked when fetched from plugin context.
// Solution: monkey-patch URL.createObjectURL before parsing to intercept
// the blobs, convert them to data URIs synchronously via FileReader,
// and replace blob: URLs in the output HTML with data: URIs.

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function loadFb2(blob: Blob): Promise<Fb2Book> {
  // Intercept URL.createObjectURL to capture blobs created by the parser
  const capturedBlobs: Record<string, Blob> = {};
  const original = (window as any).URL.createObjectURL.bind(
    (window as any).URL,
  );
  (window as any).URL.createObjectURL = (b: Blob | MediaSource) => {
    const url = original(b);
    if (b instanceof Blob) capturedBlobs[url] = b;
    return url;
  };

  const file = new File([blob], "book.fb2", { type: "text/xml" });
  let fb2Book: any;
  let rawChapters: Array<{ title: string; html: string }> = [];

  try {
    fb2Book = await initFb2File(file);
    const spine = fb2Book.getSpine();

    // loadChapter is where blob URLs are created - keep patch active until all chapters are loaded
    rawChapters = spine.map((item: any) => {
      const chapter = fb2Book.loadChapter(item.id);
      return {
        title: item.title || "Chapter",
        html: chapter?.html || "",
      };
    });
  } finally {
    // Always restore, even if initFb2File or loadChapter throws
    (window as any).URL.createObjectURL = original;
  }

  const metadata = fb2Book.getMetadata();
  const title = metadata?.title || "Untitled";

  // Build cover chapter from coverImageId + resourceStore (a Map with {id, contentType, base64Data})
  const coverImageId = (fb2Book as any).coverImageId;
  const resourceStore: Map<
    string,
    { id: string; contentType: string; base64Data: string }
  > = (fb2Book as any).resourceStore;

  let coverChapter: { title: string; html: string } | null = null;
  if (coverImageId && resourceStore?.get) {
    const coverResource = resourceStore.get(coverImageId);
    if (coverResource?.base64Data && coverResource?.contentType) {
      const dataUri = `data:${coverResource.contentType};base64,${coverResource.base64Data}`;
      coverChapter = {
        title: "Cover",
        html: `<div style="text-align:center;padding:16px;"><img src="${dataUri}" style="max-width:100%;height:auto;" /></div>`,
      };
    }
  }

  // Convert all captured blobs to data URIs
  const dataUris: Record<string, string> = {};
  await Promise.all(
    Object.entries(capturedBlobs).map(async ([url, b]) => {
      dataUris[url] = await blobToDataUri(b);
      URL.revokeObjectURL(url);
    }),
  );

  const resolvedChapters = rawChapters.map((ch) => ({
    title: ch.title,
    html: ch.html.replace(/src="(blob:[^"]+)"/gi, (_m: string, url: string) => {
      return `src="${dataUris[url] || url}"`;
    }),
  }));

  const chapters = coverChapter
    ? [coverChapter, ...resolvedChapters]
    : resolvedChapters;

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

function makeGoTo(
  fb2: Fb2Book,
  fileInfo: any,
  getCurrentIndex: () => number,
  setCurrentIndex: (i: number) => void,
  getCurrentScrollTop: () => number,
  setCurrentScrollTop: (s: number) => void,
) {
  const goTo = (index: number, scrollTop: number = 0) => {
    if (index < 0 || index >= fb2.chapters.length) return;
    setCurrentIndex(index);
    setCurrentScrollTop(scrollTop);

    saveBookmark(
      fileInfo.id,
      fileInfo.title,
      index,
      fb2.chapters.length,
      scrollTop,
    );

    const html = renderFb2Chapter(fb2, index, scrollTop);
    writeToIframe("fb2-reader-frame", html, (iframeWin) => {
      (iframeWin as any).__fb2GoTo = (idx: number) => goTo(idx, 0);
      (iframeWin as any).__fb2OnScroll = (st: number) => {
        setCurrentScrollTop(st);
        saveBookmark(
          fileInfo.id,
          fileInfo.title,
          getCurrentIndex(),
          fb2.chapters.length,
          st,
        );
      };
    });
  };
  return goTo;
}

export async function handleFb2(fileInfo: any): Promise<any> {
  const blob =
    (fileInfo as any)._rawBuffer instanceof ArrayBuffer
      ? new Blob([(fileInfo as any)._rawBuffer], { type: "text/xml" })
      : await (await fetch(fileInfo.viewUrl)).blob();

  const fb2 = await loadFb2(blob);

  cleanupOldBookmarks();
  const bookmark = getBookmark(fileInfo.id);
  let currentIndex =
    bookmark?.currentIndex && bookmark.currentIndex < fb2.chapters.length
      ? bookmark.currentIndex
      : 0;
  let currentScrollTop = bookmark?.scrollTop || 0;

  const goTo = makeGoTo(
    fb2,
    fileInfo,
    () => currentIndex,
    (i) => {
      currentIndex = i;
    },
    () => currentScrollTop,
    (s) => {
      currentScrollTop = s;
    },
  );

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
  if (!fb2Entry) throw new Error("No .fb2 file found in ZIP");

  const fb2Buffer = await fb2Entry.async("arraybuffer");
  const blob = new Blob([fb2Buffer], { type: "text/xml" });
  const fb2 = await loadFb2(blob);

  cleanupOldBookmarks();
  const bookmark = getBookmark(fileInfo.id);
  let currentIndex =
    bookmark?.currentIndex && bookmark.currentIndex < fb2.chapters.length
      ? bookmark.currentIndex
      : 0;
  let currentScrollTop = bookmark?.scrollTop || 0;

  const goTo = makeGoTo(
    fb2,
    fileInfo,
    () => currentIndex,
    (i) => {
      currentIndex = i;
    },
    () => currentScrollTop,
    (s) => {
      currentScrollTop = s;
    },
  );

  const body = makeIframeBody("fb2-reader-frame");
  setTimeout(() => goTo(currentIndex, currentScrollTop), 200);

  return { newDialogHeader: fb2.title || fileInfo.title, newDialogBody: body };
}
