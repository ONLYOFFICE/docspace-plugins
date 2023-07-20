import {
  IPlugin,
  PluginStatus,
  IApiPlugin,
  ISettingsPlugin,
  ISettings,
  IContextMenuPlugin,
  IContextMenuItem,
  ISeparatorItem,
  IInfoPanelPlugin,
  IInfoPanelItem,
} from "@onlyoffice/docspace-plugin-sdk";

class Funct
  implements
    IPlugin,
    IApiPlugin,
    ISettingsPlugin,
    IContextMenuPlugin,
    IInfoPanelPlugin
{
  status: PluginStatus = PluginStatus.active;

  origin = "";
  proxy = "";
  prefix = "";

  userPluginSettings: ISettings | null = {} as ISettings;
  adminPluginSettings: ISettings | null = {} as ISettings;

  contextMenuItems: Map<string, IContextMenuItem | ISeparatorItem> = new Map();

  infoPanelItems: Map<string, IInfoPanelItem> = new Map();

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

  getUserPluginSettings = () => {
    return this.userPluginSettings;
  };

  setUserPluginSettings = (settings: ISettings | null): void => {
    this.userPluginSettings = settings;
  };

  getAdminPluginSettings = () => {
    return this.adminPluginSettings;
  };

  setAdminPluginSettings = (settings: ISettings | null): void => {
    this.adminPluginSettings = settings;
  };

  addContextMenuItem = (item: IContextMenuItem | ISeparatorItem): void => {
    this.contextMenuItems.set(item.key, item);
  };

  getContextMenuItems = (): Map<string, IContextMenuItem | ISeparatorItem> => {
    return this.contextMenuItems;
  };

  getContextMenuItemsKeys = (): string[] => {
    const keys = Array.from(this.contextMenuItems).map(([key, item]) => key);

    return keys;
  };

  updateContextMenuItem = (item: IContextMenuItem | ISeparatorItem): void => {
    this.contextMenuItems.set(item.key, item);
  };

  addInfoPanelItem(item: IInfoPanelItem): void {
    this.infoPanelItems.set(item.key, item);
  }

  getInfoPanelItems(): Map<string, IInfoPanelItem> {
    return this.infoPanelItems;
  }

  getInfoPanelItemsKeys(): string[] {
    const keys = Array.from(this.infoPanelItems).map(([key, item]) => key);

    return keys;
  }

  updateInfoPanelItem(item: IInfoPanelItem): void {
    this.infoPanelItems.set(item.key, item);
  }
}

const plugin = new Funct();

declare global {
  interface Window {
    Plugins: any;
  }
}

window.Plugins.Funct = plugin || {};

export default plugin;
