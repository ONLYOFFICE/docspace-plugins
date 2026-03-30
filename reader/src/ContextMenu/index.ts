import {
  Devices,
  IContextMenuItem,
  FilesSecurity,
  FilesType,
  IMessage,
  Actions,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import { createReaderModal } from "../Modal";
import { validateFile } from "../Modal/validate";

export const contextMenuItem: IContextMenuItem = {
  key: "context-menu-item",
  label: "Open in Reader",
  icon: "icon-16.png",
  onClick: async (id: number): Promise<IMessage> => {
    try {
      await validateFile(id);

      const modal = createReaderModal(id);

      return {
        actions: [Actions.showModal],
        modalDialogProps: modal,
      };
    } catch (error) {
      return {
        actions: [Actions.showToast],
        toastProps: [
          {
            type: ToastType.error,
            title:
              error instanceof Error
                ? error.message
                : "Failed to open file in reader",
          },
        ],
      };
    }
  },
  fileType: [FilesType.file],
  fileExt: [".djvu", ".djv", ".epub", ".fb2", ".zip"],
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  itemSecurity: [FilesSecurity.Download],
};
