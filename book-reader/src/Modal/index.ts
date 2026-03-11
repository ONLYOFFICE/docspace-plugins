import type { IModalDialog, IMessage } from "@onlyoffice/docspace-plugin-sdk";
import { ModalDisplayType, Actions } from "@onlyoffice/docspace-plugin-sdk";
import { handleEpub } from "./formats/epub";
import { handleFb2 } from "./formats/fb2";
import { handleDjvu } from "./formats/djvu";
import { handleZip } from "./formats/zip";

// Main Modal Factory

function createReaderModal(fileId: number): IModalDialog {
  return {
    dialogHeader: "Loading…",
    dialogBody: { widthProp: "100%", heightProp: "90vh" },
    displayType: ModalDisplayType.modal,
    autoMaxHeight: true,
    autoMaxWidth: true,

    onClose: (): IMessage => {
      return { actions: [Actions.closeModal] };
    },

    async onLoad() {
      try {
        // Fetch file metadata using fileId
        const metaRes = await fetch(`/api/2.0/files/file/${fileId}`, {
          headers: { Accept: "application/json" },
        });
        const metaJson = await metaRes.json();
        const fileInfo = metaJson.response;

        const fileExt = fileInfo.title.split(".").pop()?.toLowerCase() || "";

        // EPUB
        if (fileExt === "epub") {
          return await handleEpub(fileInfo);
        }

        // FB2 + FB2.ZIP
        if (fileExt === "fb2") {
          return await handleFb2(fileInfo);
        }

        // DJVU
        if (fileExt === "djvu" || fileExt === "djv") {
          return await handleDjvu(fileInfo);
        }

        // ZIP (content sniffing)
        if (fileExt === "zip") {
          return await handleZip(fileInfo);
        }

        // fallback
        throw new Error(`Unsupported file type: .${fileExt}`);
      } catch (error) {
        console.error("Reader error:", error);
        return {
          newDialogHeader: "Error",
          newDialogBody: { frameId: "error", width: "100%", height: "90vh" },
        };
      }
    },
  };
}

export { createReaderModal };
