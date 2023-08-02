import {
  FilesExst,
  FilesType,
  IContextMenuItem,
} from "@onlyoffice/docspace-plugin-sdk";

export const convertFileItem: IContextMenuItem = {
  key: "convert-file-item",
  position: 0,
  label: "Convert file",
  icon: "logo.jpg",
  onClick: (id: number) => {},
  fileType: [FilesType.file],
  fileExt: [FilesExst.docx, FilesExst.xlsx],
};
