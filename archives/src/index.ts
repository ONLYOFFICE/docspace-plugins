/*
 * (c) Copyright Ascensio System SIA 2026
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IPlugin,
  PluginStatus,
  PluginLocale,
  IApiPlugin,
  ISettingsPlugin,
  ISettings,
  IContextMenuPlugin,
  IContextMenuItem,
  IInfoPanelPlugin,
  IInfoPanelItem,
  IMainButtonPlugin,
  IMainButtonItem,
  IPostMessageCallbackMessage,
  IProfileMenuPlugin,
  IProfileMenuItem,
  IEventListenerPlugin,
  IEventListenerItem,
  IFilePlugin,
  IFileItem,
  IPostMessagePlugin,
} from "@onlyoffice/docspace-plugin-sdk";

import archives from "./Archives";
import { i18n, setLocale } from "./locales";
import { zipFileItem } from "./File";
import {
  openZipContextMenuItem,
  unzipGroupContextMenuItem,
  zipGroupContextMenuItem,
  zipSelectedItems,
} from "./ContextMenu";

class Archives
  implements
    IPlugin,
    IApiPlugin,
    ISettingsPlugin,
    IContextMenuPlugin,
    IInfoPanelPlugin,
    IMainButtonPlugin,
    IPostMessagePlugin,
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

  registerItems = () => {
    this.updateFileItem(zipFileItem());
    this.updateContextMenuItem(openZipContextMenuItem());
    this.updateContextMenuItem(unzipGroupContextMenuItem());
    this.updateContextMenuItem(zipGroupContextMenuItem());
    this.updateContextMenuItem(zipSelectedItems());
  };

  setLanguage = (language: PluginLocale) => {
    setLocale(language);

    this.registerItems();
  };

  getLanguage = () => {
    return i18n.locale as PluginLocale;
  };

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

  private _pmListenerAdded = false;

  postMessageCallback: (message: IPostMessageCallbackMessage) => void = () => {};

  setPostMessageCallback = (callback: (message: IPostMessageCallbackMessage) => void): void => {
    this.postMessageCallback = callback;

    if (this._pmListenerAdded) return;
    this._pmListenerAdded = true;

    window.parent.addEventListener("message", async (event) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data?.source !== "archivesplugin") return;

        switch (data.action) {
          case "open-selector":
            const msg = await archives.openSelector(data.path, data.content);
            this.postMessageCallback(msg);
            break;
          default:
            break;
        }
      } catch {
        // ignore non-JSON messages
      }
    });
  };

  getPostMessageCallback = (): ((message: IPostMessageCallbackMessage) => void) => {
    return this.postMessageCallback;
  };
}

const plugin = new Archives();

declare global {
  interface Window {
    Plugins: any;
  }
}

plugin.registerItems();

window.Plugins.ZipArchives = plugin || {};

export default plugin;
