import {
  IPlugin,
  PluginStatus,
  IApiPlugin,
  IContextMenuPlugin,
  IContextMenuItem,
  ISettingsPlugin,
  ISettings,
} from "@onlyoffice/docspace-plugin-sdk";

import { convertFileItem } from "./ContextMenuItem";
import { adminSettings } from "./Settings";
import convertFile from "./ConvertFile";

class ConvertFilePlugin
  implements IPlugin, ISettingsPlugin, IApiPlugin, IContextMenuPlugin
{
  adminPluginSettings: ISettings | null = null;

  status: PluginStatus = PluginStatus.hide;

  origin = "";
  proxy = "";
  prefix = "";

  contextMenuItems: Map<string, IContextMenuItem> = new Map();

  onLoadCallback = async () => {};

  updateStatus = (status: PluginStatus) => {
    this.status = status;
  };

  getStatus = () => {
    return this.status;
  };

  setOnLoadCallback = (callback: () => Promise<void>) => {
    this.onLoadCallback = callback;
  };

  setOrigin = (origin: string): void => {
    this.origin = origin;
  };

  getOrigin = (): string => {
    return this.origin;
  };

  setProxy = (proxy: string): void => {
    this.proxy = proxy;
  };

  getProxy = (): string => {
    return this.proxy;
  };

  setPrefix = (prefix: string): void => {
    this.prefix = prefix;
  };

  getPrefix = (): string => {
    return this.prefix;
  };

  setAPI = (origin: string, proxy: string, prefix: string): void => {
    this.origin = origin;
    this.proxy = proxy;
    this.prefix = prefix;
  };

  getAPI = (): { origin: string; proxy: string; prefix: string } => {
    return { origin: this.origin, proxy: this.proxy, prefix: this.prefix };
  };

  setAdminPluginSettings = (settings: ISettings | null): void => {
    this.adminPluginSettings = settings;
  };
  getAdminPluginSettings = (): ISettings | null => {
    return this.adminPluginSettings;
  };

  addContextMenuItem = (item: IContextMenuItem): void => {
    this.contextMenuItems.set(item.key, item);
  };

  getContextMenuItemsKeys = (): string[] => {
    const keys = Array.from(this.contextMenuItems).map(([key, item]) => key);

    return keys;
  };

  getContextMenuItems = (): Map<string, IContextMenuItem> => {
    return this.contextMenuItems;
  };

  updateContextMenuItem = (item: IContextMenuItem): void => {
    this.contextMenuItems.set(item.key, item);
  };
}

const plugin = new ConvertFilePlugin();

plugin.addContextMenuItem(convertFileItem);
plugin.setAdminPluginSettings(adminSettings);
plugin.setOnLoadCallback(convertFile.fetchAPIToken);

declare global {
  interface Window {
    Plugins: any;
  }
}

window.Plugins.PDFConverter = plugin || {};

export default plugin;
