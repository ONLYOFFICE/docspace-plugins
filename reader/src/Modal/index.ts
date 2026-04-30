import {
  Actions,
  Components,
  IMessage,
  IModalDialog,
  ModalDisplayType,
  ISkeleton,
} from "@onlyoffice/docspace-plugin-sdk";
import { handleEpub } from "./formats/epub";
import { handleFb2 } from "./formats/fb2";
import { handleZip } from "./formats/zip";
import { makeIframeBody, writeToIframe } from "./utils/iframe";

const ERROR_FRAME = "reader-error-frame";

function showErrorBody(message: string) {
  const body = makeIframeBody(ERROR_FRAME);

  setTimeout(() => {
    writeToIframe(
      ERROR_FRAME,
      `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  html, body { height: 100%; margin: 0; padding: 0; }
  body {
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px;
    background: #fff; font-family: Arial, sans-serif; color: #333;
  }
  .icon { font-size: 48px; }
  .msg { font-size: 15px; color: #555; text-align: center; max-width: 400px; }
</style>
</head>
<body>
  <div class="icon">&#9888;&#65039;</div>
  <div class="msg">${message}</div>
</body>
</html>`,
    );
  }, 100);

  return { newDialogHeader: "File Not Supported", newDialogBody: body };
}

export function createReaderModal(fileId: number): IModalDialog {
  const loadingBody = {
    widthProp: "90vw",
    heightProp: "90vh",
    children: [
      {
        component: Components.skeleton,
        props: { width: "100%", height: "100%" } as ISkeleton,
      },
    ],
  };

  return {
    dialogHeader: "Loading\u2026",
    dialogBody: loadingBody as any,
    displayType: ModalDisplayType.modal,
    autoMaxHeight: true,
    autoMaxWidth: true,

    onClose: (): IMessage => ({
      actions: [Actions.closeModal],
    }),

    onLoad: async () => {
      try {
        const metaRes = await fetch(`/api/2.0/files/file/${fileId}`, {
          headers: { Accept: "application/json" },
        });
        const fileInfo = (await metaRes.json()).response;

        const fileExt = (fileInfo.fileExst ?? "")
          .toLowerCase()
          .replace(/^\./, "");

        if (fileExt === "epub") return await handleEpub(fileInfo);
        if (fileExt === "fb2") return await handleFb2(fileInfo);
        if (fileExt === "zip") return await handleZip(fileInfo);

        return showErrorBody(
          `File type .${fileExt} is not supported. Supported formats: EPUB, FB2, ZIP.`,
        );
      } catch (error: any) {
        return showErrorBody(error?.message ?? "An unexpected error occurred.");
      }
    },
  };
}
