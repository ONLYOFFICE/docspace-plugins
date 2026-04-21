import {
  IFileItem,
  File,
  Devices,
  Actions,
  IMessage,
} from "@onlyoffice/docspace-plugin-sdk";
import { createReaderModal } from "../Modal";

const supportedExtensions = ["epub", "fb2", "zip"];

const onClick = (item: File): IMessage => {
  const modal = createReaderModal(item.id);

  return {
    actions: [Actions.showModal],
    modalDialogProps: modal,
  };
};

const readerFileItems: IFileItem[] = [];

for (const ext of supportedExtensions) {
  readerFileItems.push({
    extension: "." + ext,
    fileTypeName: "Book",
    fileRowIcon: "icon-16.png",
    fileTileIcon: "icon-16.png",
    devices: [Devices.desktop, Devices.mobile, Devices.tablet],
    onClick,
  });
}

export { readerFileItems };
