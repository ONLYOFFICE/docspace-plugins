import { IFileItem, File, Devices } from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../Drawio";

const onClick = async (item: File) => {
  return await drawIo.editDiagram(item.id);
};

export const drawIoItem: IFileItem = {
  extension: ".drawio",
  fileTypeName: "Diagram",
  fileRowIcon: "drawio-32.svg",
  fileTileIcon: "drawio-32.svg",
  devices: [Devices.desktop],
  onClick,
};
