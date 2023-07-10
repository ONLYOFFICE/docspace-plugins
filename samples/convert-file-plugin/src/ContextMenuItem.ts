import {
  ContextMenuItemType,
  FilesExst,
  IContextMenuItem,
} from "onlyoffice-docspace-plugin";

export const convertFileItem: IContextMenuItem = {
  key: "convert-file-item",
  type: ContextMenuItemType.Files,
  position: 0,
  label: "Convert file",
  icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF5z5FvWU-DjRHm8ankd_VwHEgpSSGRhVUiA&usqp=CAU",
  onClick: () => {},
  fileExt: [FilesExst.docx, FilesExst.xlsx],
};
