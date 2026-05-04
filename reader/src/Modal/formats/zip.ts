import JSZip from "jszip";
import { handleEpub } from "./epub";
import { handleFb2 } from "./fb2";
import { makeIframeBody } from "../utils/iframe";

export async function handleZip(
  fileInfo: any,
): Promise<{ newDialogHeader: string; newDialogBody: any }> {
  const fileUrl = fileInfo.viewUrl ?? fileInfo.webUrl ?? "";

  const response = await fetch(fileUrl);
  if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
  const buffer = await response.arrayBuffer();

  const zip = await JSZip.loadAsync(buffer);

  // ── EPUB: the ZIP itself IS an EPUB (contains META-INF/container.xml) ─────
  if (zip.file("META-INF/container.xml")) {
    return handleEpub({ ...fileInfo, _zipBuffer: buffer } as any);
  }

  // ── EPUB file nested inside ZIP ───────────────────────────────────────────
  const epubFile = Object.keys(zip.files).find((name) =>
    name.toLowerCase().endsWith(".epub"),
  );
  if (epubFile) {
    const epubBuffer = await zip.file(epubFile)!.async("arraybuffer");
    return handleEpub({ ...fileInfo, _zipBuffer: epubBuffer } as any);
  }

  // ── FB2 inside ZIP ────────────────────────────────────────────────────────
  const fb2File = Object.keys(zip.files).find((name) =>
    name.toLowerCase().endsWith(".fb2"),
  );
  if (fb2File) {
    const fb2Buffer = await zip.file(fb2File)!.async("arraybuffer");
    return handleFb2({
      ...fileInfo,
      _rawBuffer: fb2Buffer,
      title: fb2File,
    } as any);
  }

  throw new Error(
    "This ZIP does not contain a recognised book format. " +
      "Supported formats inside a ZIP: EPUB or .fb2.",
  );
}
