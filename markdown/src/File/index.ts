import { IFileItem, File, Devices } from "@onlyoffice/docspace-plugin-sdk";

import markdownIt from "../Markdownit";

const onClick = async (item: File) => {
  return await markdownIt.editMarkdown(item.id, false);
};

export const markdownitItem: IFileItem = {
  extension: ".md",
  fileTypeName: "Markdown",
  fileRowIcon: "markdown.svg",
  fileTileIcon: "markdown.svg",
  devices: [Devices.desktop],
  onClick,
};
