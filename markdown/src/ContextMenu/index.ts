import {
  Devices,
  FilesType,
  IContextMenuItem,
} from "@onlyoffice/docspace-plugin-sdk";
import markdownIt from "../Markdownit";

const onClick = async (id: number) => {
  const message = await markdownIt.editMarkdown(id, false);

  return message;
};

const onViewClick = async (id: number) => {
  const message = await markdownIt.editMarkdown(id, true);

  return message;
};

export const contextMenuItem: IContextMenuItem = {
  key: "markdownit-context-menu-item",
  label: "Edit markdown",
  onClick,
  icon: "markdown.svg",
  fileType: [FilesType.file],
  devices: [Devices.desktop],
  fileExt: [".md"],
};

export const contextMenuViewerItem: IContextMenuItem = {
  key: "markdownit-context-menu-viewer-item",
  label: "Preview markdown",
  onClick: onViewClick,
  icon: "view.svg",
  fileType: [FilesType.file],
  devices: [Devices.desktop],
  fileExt: [".md"],
};