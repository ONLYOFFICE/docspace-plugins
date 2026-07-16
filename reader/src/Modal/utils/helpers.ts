// Helper utilities

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function mimeFromExt(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    css: "text/css",
    html: "text/html",
    xhtml: "application/xhtml+xml",
  };
  return map[ext || ""] || "application/octet-stream";
}

export function resolvePath(base: string, relative: string): string {
  if (
    relative.startsWith("http://") ||
    relative.startsWith("https://") ||
    relative.startsWith("data:")
  ) {
    return relative;
  }
  const baseParts = base.split("/");
  baseParts.pop();
  const relParts = relative.split("/");
  for (const part of relParts) {
    if (part === "..") baseParts.pop();
    else if (part !== ".") baseParts.push(part);
  }
  return baseParts.join("/");
}
