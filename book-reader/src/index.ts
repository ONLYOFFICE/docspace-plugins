import {
  IPlugin,
  PluginStatus,
  IContextMenuPlugin,
  IContextMenuItem,
  IFilePlugin,
  IFileItem,
} from "@onlyoffice/docspace-plugin-sdk";

import { contextMenuItem } from "./ContextMenu";
import {
  epubFileItem,
  fb2FileItem,
  djvuFileItem,
  djvFileItem,
  zipFileItem,
} from "./File";

class BookReader implements IPlugin, IContextMenuPlugin, IFilePlugin {
  status: PluginStatus = PluginStatus.active;
  contextMenuItems: Map<string, IContextMenuItem> = new Map();
  fileItems: Map<string, IFileItem> = new Map();

  onLoadCallback = async () => {
    console.log("Reader Mode Plugin loaded");
  };

  updateStatus = (status: PluginStatus) => {
    this.status = status;
  };

  getStatus = () => {
    return this.status;
  };

  setOnLoadCallback = (callback: () => Promise<void>) => {
    this.onLoadCallback = callback;
  };

  addContextMenuItem = (item: IContextMenuItem): void => {
    this.contextMenuItems.set(item.key, item);
  };

  getContextMenuItems = (): Map<string, IContextMenuItem> => {
    return this.contextMenuItems;
  };

  getContextMenuItemsKeys = (): string[] => {
    const keys = Array.from(this.contextMenuItems).map(([key, item]) => key);
    return keys;
  };

  updateContextMenuItem = (item: IContextMenuItem): void => {
    this.contextMenuItems.set(item.key, item);
  };

  getFileItems = (): Map<string, IFileItem> => {
    return this.fileItems;
  };

  addFileItem = (item: IFileItem): void => {
    this.fileItems.set(item.extension, item);
  };

  updateFileItem = (item: IFileItem): void => {
    this.fileItems.set(item.extension, item);
  };
}

const plugin = new BookReader();

declare global {
  interface Window {
    Plugins: any;
  }
}

// Register context menu
plugin.addContextMenuItem(contextMenuItem);

// Register all file items
plugin.addFileItem(epubFileItem);
plugin.addFileItem(fb2FileItem);
plugin.addFileItem(djvuFileItem);
plugin.addFileItem(djvFileItem);
plugin.addFileItem(zipFileItem);

console.log(
  "Reader Mode: Registered file items for .epub, .fb2, .djvu, .djv, .zip",
);

window.Plugins.BookReader = plugin || {};

export default plugin;
