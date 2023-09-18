import { IFileItem, File } from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../Drawio";

const onClick = async (item: File) => {
  return await drawIo.editDiagram(item.id);
};

export const drawIoItem: IFileItem = {
  extension: ".drawio",
  fileTypeName: "Diagram",
  fileIcon: "drawio-32.svg",
  onClick,
};
