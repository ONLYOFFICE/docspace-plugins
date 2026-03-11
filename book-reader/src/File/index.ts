import {
  IFileItem,
  File,
  Devices,
  Actions,
  IMessage,
} from "@onlyoffice/docspace-plugin-sdk";
import { createReaderModal } from "../Modal";

export const epubFileItem: IFileItem = {
  extension: ".epub",
  fileTypeName: "EPUB Book",
  fileRowIcon: "icon-16.png",
  fileTileIcon: "icon-16.png",
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  onClick: (item: File): IMessage => {
    console.log("Opening EPUB file in reader:", item.id);

    const modal = createReaderModal(item.id);

    return {
      actions: [Actions.showModal],
      modalDialogProps: modal,
    };
  },
};

export const fb2FileItem: IFileItem = {
  extension: ".fb2",
  fileTypeName: "FB2 Book",
  fileRowIcon: "icon-16.png",
  fileTileIcon: "icon-16.png",
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  onClick: (item: File): IMessage => {
    console.log("Opening FB2 file in reader:", item.id);

    const modal = createReaderModal(item.id);

    return {
      actions: [Actions.showModal],
      modalDialogProps: modal,
    };
  },
};

export const djvuFileItem: IFileItem = {
  extension: ".djvu",
  fileTypeName: "DjVu Document",
  fileRowIcon: "icon-16.png",
  fileTileIcon: "icon-16.png",
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  onClick: (item: File): IMessage => {
    console.log("Opening DjVu file in reader:", item.id);

    const modal = createReaderModal(item.id);

    return {
      actions: [Actions.showModal],
      modalDialogProps: modal,
    };
  },
};

export const djvFileItem: IFileItem = {
  extension: ".djv",
  fileTypeName: "DjVu Document",
  fileRowIcon: "icon-16.png",
  fileTileIcon: "icon-16.png",
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  onClick: (item: File): IMessage => {
    console.log("Opening DjVu file in reader:", item.id);

    const modal = createReaderModal(item.id);

    return {
      actions: [Actions.showModal],
      modalDialogProps: modal,
    };
  },
};

export const zipFileItem: IFileItem = {
  extension: ".zip",
  fileTypeName: "Book Archive",
  fileRowIcon: "icon-16.png",
  fileTileIcon: "icon-16.png",
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  onClick: (item: File): IMessage => {
    console.log("Opening ZIP file in reader:", item.id);

    const modal = createReaderModal(item.id);

    return {
      actions: [Actions.showModal],
      modalDialogProps: modal,
    };
  },
};
