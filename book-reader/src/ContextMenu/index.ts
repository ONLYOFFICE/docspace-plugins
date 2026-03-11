import {
  Devices,
  FilesType,
  IContextMenuItem,
  FilesSecurity,
  IMessage,
  Actions,
} from "@onlyoffice/docspace-plugin-sdk";
import { createReaderModal } from "../Modal";

export const contextMenuItem: IContextMenuItem = {
  key: "context-menu-item",
  label: "Open in Reader",
  icon: "icon-16.png",
  onClick: async (id: number): Promise<IMessage> => {
    console.log("Context menu clicked, File ID:", id);

    try {
      console.log("Fetching file metadata...");
      const response = await fetch(`/api/2.0/files/file/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const fileData = await response.json();
      const fileInfo = fileData.response;

      console.log("File info loaded:", fileInfo.title, fileInfo.fileExst);

      const modal = createReaderModal(id);

      const message: IMessage = {
        actions: [Actions.showModal],
        modalDialogProps: modal,
      };

      console.log("Returning modal message");
      return message;
    } catch (error) {
      console.error("Error in reader:", error);

      const errorModal = createReaderModal(id);
      return {
        actions: [Actions.showModal],
        modalDialogProps: errorModal,
      };
    }
  },
  fileType: [FilesType.file],
  fileExt: [".djvu", ".djv", ".epub", ".fb2", ".zip"],
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  itemSecurity: [FilesSecurity.Download],
};
