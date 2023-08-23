import {
  IPlugin,
  PluginStatus,
  ISeparatorItem,
  IApiPlugin,
  ISettingsPlugin,
  ISettings,
  IContextMenuPlugin,
  IContextMenuItem,
} from "@onlyoffice/docspace-plugin-sdk";
import { contextMenuItem } from "./ContextMenuItem";
import assemblyAI from "./AssemblyAI";
import { userSettings } from "./Settings";

class SpeechToText
  implements IPlugin, IApiPlugin, ISettingsPlugin, IContextMenuPlugin
{
  status: PluginStatus = PluginStatus.pending;

  origin = "";
  proxy = "";
  prefix = "";

  userPluginSettings: ISettings | null = {} as ISettings;
  adminPluginSettings: ISettings | null = {} as ISettings;

  contextMenuItems: Map<string, IContextMenuItem | ISeparatorItem> = new Map();

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
}

const plugin = new SpeechToText();

plugin.addContextMenuItem(contextMenuItem);
plugin.setUserPluginSettings(userSettings);
plugin.setOnLoadCallback(assemblyAI.fetchAPIToken);

declare global {
  interface Window {
    Plugins: any;
  }
}

window.Plugins.SpeechToText = plugin || {};

export default plugin;
