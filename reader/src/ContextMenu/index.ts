import {
  Actions,
  Devices,
  FilesType,
  IContextMenuItem,
  IMessage,
  IToast,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import { createReaderModal } from "../Modal";

export const contextMenuItem: IContextMenuItem = {
  key: "book-reader-context-menu",
  label: "Open in Reader",
  icon: "icon-16.png",
  fileExt: [".epub", ".fb2", ".zip"],
  fileType: [FilesType.file],
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],

  onClick: (id: number): IMessage => {
    try {
      return {
        actions: [Actions.showModal],
        modalDialogProps: createReaderModal(id),
      };
    } catch (e: any) {
      const toastProps: IToast = {
        type: ToastType.error,
        title: e?.message ?? "Could not open file",
      };
      return { actions: [Actions.showToast], toastProps: [toastProps] };
    }
  },
};
