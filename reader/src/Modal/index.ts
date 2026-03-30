import type { IModalDialog, IMessage } from "@onlyoffice/docspace-plugin-sdk";
import { ModalDisplayType, Actions } from "@onlyoffice/docspace-plugin-sdk";
import { handleEpub } from "./formats/epub";
import { handleFb2 } from "./formats/fb2";
import { handleDjvu } from "./formats/djvu";
import { handleZip } from "./formats/zip";
import { makeIframeBody, writeToIframe, getModalHeight } from "./utils/iframe";

function createErrorBody(message: string): any {
  const body = makeIframeBody("reader-error-frame");

  setTimeout(() => {
    writeToIframe(
      "reader-error-frame",
      `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: sans-serif;
            background: #fff;
          }
          .error-box {
            text-align: center;
            padding: 40px;
            color: #333;
          }
          .error-icon {
            font-size: 48px;
            margin-bottom: 16px;
          }
          .error-message {
            font-size: 16px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="error-box">
          <div class="error-icon">⚠️</div>
          <div class="error-message">${message}</div>
        </div>
      </body>
      </html>`,
    );
  }, 200);

  return body;
}

function createLoadingBody(): any {
  const body = makeIframeBody("reader-loading-frame");

  setTimeout(() => {
    writeToIframe(
      "reader-loading-frame",
      `<!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: sans-serif;
            background: #fff;
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 5px solid #e0e0e0;
            border-top-color: #4d8cf0;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="spinner"></div>
      </body>
      </html>`,
    );
  }, 200);

  return body;
}

function createReaderModal(fileId: number): IModalDialog {
  const modalHeight = getModalHeight();

  return {
    dialogHeader: "Loading…",
    dialogBody: createLoadingBody(),
    displayType: ModalDisplayType.modal,
    autoMaxHeight: true,
    autoMaxWidth: true,

    onClose: (): IMessage => {
      return { actions: [Actions.closeModal] };
    },

    async onLoad() {
      try {
        const metaRes = await fetch(`/api/2.0/files/file/${fileId}`, {
          headers: { Accept: "application/json" },
        });
        const metaJson = await metaRes.json();
        const fileInfo = metaJson.response;

        const fileExt = fileInfo.title.split(".").pop()?.toLowerCase() || "";

        if (fileExt === "epub") {
          return await handleEpub(fileInfo);
        }

        if (fileExt === "fb2") {
          return await handleFb2(fileInfo);
        }

        if (fileExt === "djvu" || fileExt === "djv") {
          return await handleDjvu(fileInfo);
        }

        if (fileExt === "zip") {
          return await handleZip(fileInfo);
        }

        throw new Error(`Unsupported file type: .${fileExt}`);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to open file in reader";

        return {
          newDialogHeader: "File Not Supported",
          newDialogBody: createErrorBody(message),
        };
      }
    },
  };
}

export { createReaderModal };
