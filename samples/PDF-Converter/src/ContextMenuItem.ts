import {
  FilesType,
  IContextMenuItem,
  UsersType,
} from "@onlyoffice/docspace-plugin-sdk";
import convertFile from "./ConvertFile";

export const convertFileItem: IContextMenuItem = {
  key: "convert-file-item",
  label: "Convert to PDF",
  icon: "convert-16.png",
  onClick: convertFile.onOpenModalDialog,
  fileType: [FilesType.file],
  usersTypes: [UsersType.owner, UsersType.docSpaceAdmin, UsersType.roomAdmin],
};
