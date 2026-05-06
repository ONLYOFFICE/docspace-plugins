// Bookmark utilities using localStorage

interface Bookmark {
  fileId: number;
  fileName: string;
  currentIndex: number;
  totalPages: number;
  scrollTop: number;
  lastRead: number; // timestamp
}

const STORAGE_KEY = "onlyoffice-reader-bookmarks";

function getAllBookmarks(): Record<string, Bookmark> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveAllBookmarks(bookmarks: Record<string, Bookmark>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // ignore
  }
}

export function getBookmark(fileId: number): Bookmark | null {
  const bookmarks = getAllBookmarks();
  const key = `file_${fileId}`;
  return bookmarks[key] || null;
}

export function saveBookmark(
  fileId: number,
  fileName: string,
  currentIndex: number,
  totalPages: number,
  scrollTop: number = 0,
): void {
  const bookmarks = getAllBookmarks();
  const key = `file_${fileId}`;

  bookmarks[key] = {
    fileId,
    fileName,
    currentIndex,
    totalPages,
    scrollTop,
    lastRead: Date.now(),
  };

  saveAllBookmarks(bookmarks);
}

export function clearBookmark(fileId: number): void {
  const bookmarks = getAllBookmarks();
  const key = `file_${fileId}`;
  delete bookmarks[key];
  saveAllBookmarks(bookmarks);
}

export function cleanupOldBookmarks(): void {
  const bookmarks = getAllBookmarks();
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

  let cleaned = false;
  for (const key in bookmarks) {
    if (bookmarks[key].lastRead < ninetyDaysAgo) {
      delete bookmarks[key];
      cleaned = true;
    }
  }

  if (cleaned) {
    saveAllBookmarks(bookmarks);
  }
}
