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

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function loadFb2(blob: Blob): Promise<Fb2Book> {
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
    rawChapters = spine.map((item: any) => {
      const chapter = fb2Book.loadChapter(item.id);
      return { title: item.title || "Chapter", html: chapter?.html || "" };
    });
  } finally {
    (window as any).URL.createObjectURL = original;
  }

  const metadata = fb2Book.getMetadata();
  const title = metadata?.title || "Untitled";

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

  const dataUris: Record<string, string> = {};
  await Promise.all(
    Object.entries(capturedBlobs).map(async ([url, b]) => {
      dataUris[url] = await blobToDataUri(b);
      URL.revokeObjectURL(url);
    }),
  );

  const resolvedChapters = rawChapters.map((ch) => ({
    title: ch.title,
    html: ch.html.replace(
      /src="(blob:[^"]+)"/gi,
      (_m: string, url: string) => `src="${dataUris[url] || url}"`,
    ),
  }));

  return {
    title,
    chapters: coverChapter
      ? [coverChapter, ...resolvedChapters]
      : resolvedChapters,
  };
}

function renderFb2Chapter(
  fb2: Fb2Book,
  index: number,
  scrollTop: number = 0,
): string {
  const total = fb2.chapters.length;
  return generateSpreadHTML({
    content: fb2.chapters[index]?.html || "",
    currentPage: index + 1,
    totalPages: total,
    hasNext: index < total - 1,
    hasPrevious: index > 0,
    scrollTop,
    onScroll: "__fb2OnScroll",
    onPrevious: index > 0 ? `__fb2GoTo(${index - 1})` : "",
    onNext: index < total - 1 ? `__fb2GoTo(${index + 1})` : "",
  });
}

async function handleFb2Book(fileInfo: any, fb2: Fb2Book): Promise<any> {
  cleanupOldBookmarks();
  const bookmark = getBookmark(fileInfo.id);
  let currentIndex =
    bookmark?.currentIndex && bookmark.currentIndex < fb2.chapters.length
      ? bookmark.currentIndex
      : 0;
  let currentScrollTop = bookmark?.scrollTop || 0;

  const frameName = "fb2-reader-frame";

  const goTo = (index: number, scrollTop: number = 0) => {
    if (index < 0 || index >= fb2.chapters.length) return;
    currentIndex = index;
    currentScrollTop = scrollTop;
    saveBookmark(
      fileInfo.id,
      fileInfo.title,
      currentIndex,
      fb2.chapters.length,
      scrollTop,
    );

    writeToIframe(
      frameName,
      renderFb2Chapter(fb2, currentIndex, scrollTop),
      (iframeWin) => {
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
      },
    );
  };

  const body = makeIframeBody(frameName);
  setTimeout(() => goTo(currentIndex, currentScrollTop), 200);

  return { newDialogHeader: fb2.title || fileInfo.title, newDialogBody: body };
}

export async function handleFb2(fileInfo: any): Promise<any> {
  const blob =
    (fileInfo as any)._rawBuffer instanceof ArrayBuffer
      ? new Blob([(fileInfo as any)._rawBuffer], { type: "text/xml" })
      : await (await fetch(fileInfo.viewUrl)).blob();

  return handleFb2Book(fileInfo, await loadFb2(blob));
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
  return handleFb2Book(fileInfo, await loadFb2(blob));
}
