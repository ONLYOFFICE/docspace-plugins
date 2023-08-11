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
  position: 0,
  label: "Edit diagram",
  onClick,
  icon: "drawio.png",
  devices: [Devices.desktop],
  fileType: [FilesType.image],
};
