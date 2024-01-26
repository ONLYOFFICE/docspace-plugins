import {
  IPlugin,
  PluginStatus,
  IApiPlugin,
  ISettingsPlugin,
  ISettings,
  IContextMenuPlugin,
  IContextMenuItem,
  IInfoPanelPlugin,
  IInfoPanelItem,
  IMainButtonPlugin,
  IMainButtonItem,
  IProfileMenuPlugin,
  IProfileMenuItem,
  IEventListenerPlugin,
  IEventListenerItem,
  IFilePlugin,
  IFileItem,
} from "@onlyoffice/docspace-plugin-sdk";
import { markdownitItem } from "./File";
import { contextMenuItem, contextMenuViewerItem } from "./ContextMenu";
import { mainButtonItem } from "./MainButton";

class Markdown
  implements
    IPlugin,
    IApiPlugin,
    ISettingsPlugin,
    IContextMenuPlugin,
    IInfoPanelPlugin,
    IMainButtonPlugin,
    IProfileMenuPlugin,
    IEventListenerPlugin,
    IFilePlugin
{
  status: PluginStatus = PluginStatus.active;

  origin = "";
  proxy = "";
  prefix = "";

  adminPluginSettings: ISettings | null = {} as ISettings;

  contextMenuItems: Map<string, IContextMenuItem> = new Map();

  infoPanelItems: Map<string, IInfoPanelItem> = new Map();

  mainButtonItems: Map<string, IMainButtonItem> = new Map();

  profileMenuItems: Map<string, IProfileMenuItem> = new Map();

  eventListenerItems: Map<string, IEventListenerItem> = new Map();

  fileItems: Map<string, IFileItem> = new Map();

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

  getAdminPluginSettings = () => {
    return this.adminPluginSettings;
  };

  setAdminPluginSettings = (settings: ISettings | null): void => {
    this.adminPluginSettings = settings;
  };

  setAdminPluginSettingsValue = (settings: string | null): void => {};

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

  addInfoPanelItem = (item: IInfoPanelItem): void => {
    this.infoPanelItems.set(item.key, item);
  };

  getInfoPanelItems = (): Map<string, IInfoPanelItem> => {
    return this.infoPanelItems;
  };

  updateInfoPanelItem = (item: IInfoPanelItem): void => {
    this.infoPanelItems.set(item.key, item);
  };

  addMainButtonItem = (item: IMainButtonItem): void => {
    this.mainButtonItems.set(item.key, item);
  };

  getMainButtonItems = (): Map<string, IMainButtonItem> => {
    return this.mainButtonItems;
  };

  updateMainButtonItem = (item: IMainButtonItem): void => {
    this.mainButtonItems.set(item.key, item);
  };

  addProfileMenuItem = (item: IProfileMenuItem): void => {
    this.profileMenuItems.set(item.key, item);
  };

  getProfileMenuItems = (): Map<string, IProfileMenuItem> => {
    return this.profileMenuItems;
  };

  updateProfileMenuItem = (item: IProfileMenuItem): void => {
    this.profileMenuItems.set(item.key, item);
  };

  addEventListenerItem = (item: IEventListenerItem): void => {
    this.eventListenerItems.set(item.key, item);
  };

  getEventListenerItems = (): Map<string, IEventListenerItem> => {
    return this.eventListenerItems;
  };

  addFileItem = (item: IFileItem): void => {
    this.fileItems.set(item.extension, item);
  };

  getFileItems = (): Map<string, IFileItem> => {
    return this.fileItems;
  };

  updateFileItem = (item: IFileItem): void => {
    this.fileItems.set(item.extension, item);
  };
}

const plugin = new Markdown();

declare global {
  interface Window {
    Plugins: any;
  }
}

plugin.addFileItem(markdownitItem);
plugin.addContextMenuItem(contextMenuItem);
plugin.addContextMenuItem(contextMenuViewerItem);
plugin.addMainButtonItem(mainButtonItem);

window.Plugins.Markdown = plugin || {};

export default plugin;
