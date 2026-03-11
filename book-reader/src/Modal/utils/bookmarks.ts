// Bookmark utilities using localStorage

interface Bookmark {
  fileId: number;
  fileName: string;
  currentIndex: number;
  totalPages: number;
  lastRead: number; // timestamp
}

const STORAGE_KEY = "onlyoffice-reader-bookmarks";

// Get all bookmarks
function getAllBookmarks(): Record<string, Bookmark> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading bookmarks:", error);
    return {};
  }
}

// Save all bookmarks
function saveAllBookmarks(bookmarks: Record<string, Bookmark>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error saving bookmarks:", error);
  }
}

// Get bookmark for a specific file
export function getBookmark(fileId: number): Bookmark | null {
  const bookmarks = getAllBookmarks();
  const key = `file_${fileId}`;
  return bookmarks[key] || null;
}

// Save bookmark for a file
export function saveBookmark(
  fileId: number,
  fileName: string,
  currentIndex: number,
  totalPages: number,
): void {
  const bookmarks = getAllBookmarks();
  const key = `file_${fileId}`;

  bookmarks[key] = {
    fileId,
    fileName,
    currentIndex,
    totalPages,
    lastRead: Date.now(),
  };

  saveAllBookmarks(bookmarks);
}

// Clear bookmark for a file
export function clearBookmark(fileId: number): void {
  const bookmarks = getAllBookmarks();
  const key = `file_${fileId}`;
  delete bookmarks[key];
  saveAllBookmarks(bookmarks);
}

// Clean up old bookmarks (older than 90 days)
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
