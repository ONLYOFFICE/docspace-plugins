export async function validateFile(fileId: number): Promise<void> {
  const metaRes = await fetch(`/api/2.0/files/file/${fileId}`, {
    headers: { Accept: "application/json" },
  });
  const metaJson = await metaRes.json();
  const fileInfo = metaJson.response;

  const fileExt = fileInfo.title.split(".").pop()?.toLowerCase() || "";

  if (["epub", "fb2", "djvu", "djv", "zip"].includes(fileExt)) {
    return;
  }

  throw new Error(`Unsupported file type: .${fileExt}`);
}
