import {
    Devices,
    FilesExst,
    FilesType,
    IContextMenuItem,
  } from "@onlyoffice/docspace-plugin-sdk";
  import markdownIt from "../Markdownit";
  
  const onClick = async (id: number) => {
    const message = await markdownIt.editMarkdown(id);
  
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