import {
  FilesExst,
  FilesType,
  IContextMenuItem,
} from "@onlyoffice/docspace-plugin-sdk";

export const convertFileItem: IContextMenuItem = {
  key: "convert-file-item",
  position: 0,
  label: "Convert file",
  icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF5z5FvWU-DjRHm8ankd_VwHEgpSSGRhVUiA&usqp=CAU",
  onClick: () => {},
  fileType: [FilesType.file],
  fileExt: [FilesExst.docx, FilesExst.xlsx],
};
