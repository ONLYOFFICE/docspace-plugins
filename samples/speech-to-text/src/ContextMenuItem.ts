import { FilesType, IContextMenuItem } from "@onlyoffice/docspace-plugin-sdk";

import assemblyAI from "./AssemblyAI";

export const contextMenuItem: IContextMenuItem = {
  key: "speech-to-text-context-menu-item",
  label: "Convert to text",
  icon: "speech-to-text-16.png",
  onClick: assemblyAI.speechToText,
  fileType: [FilesType.video],
  withActiveItem: true,
};
