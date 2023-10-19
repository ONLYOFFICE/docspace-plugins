import {
  Devices,
  FilesExst,
  FilesType,
  IContextMenuItem,
} from "@onlyoffice/docspace-plugin-sdk";
import drawIo from "../Drawio";

const onClick = async (id: number) => {
  const message = await drawIo.editDiagram(id);

  return message;
};

export const contextMenuItem: IContextMenuItem = {
  key: "drawio-context-menu-item",
  label: "Edit diagram",
  onClick,
  icon: "drawio.png",
  fileType: [FilesType.image, FilesType.file],
  devices: [Devices.desktop],
  fileExt: [".drawio", ".png"],
};
