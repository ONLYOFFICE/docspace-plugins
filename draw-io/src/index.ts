/*
* (c) Copyright Ascensio System SIA 2023
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
  IApiPlugin,
  ISettingsPlugin,
  ISettings,
  IContextMenuPlugin,
  IContextMenuItem,
  IMainButtonPlugin,
  IMainButtonItem,
  IFilePlugin,
  IFileItem,
} from "@onlyoffice/docspace-plugin-sdk";

import { adminSettings } from "./Settings/Admin";

import { contextMenuItem } from "./ContextMenu";
import { mainButtonItem } from "./MainButton";
import { drawIoItem } from "./File";

import drawIo from "./Drawio";

class Drawio
  implements
    IPlugin,
    IApiPlugin,
    ISettingsPlugin,
    IContextMenuPlugin,
    IMainButtonPlugin,
    IFilePlugin
{
  status: PluginStatus = PluginStatus.active;

  origin = "";
  proxy = "";
  prefix = "";

  userPluginSettings: ISettings | null = {} as ISettings;
  adminPluginSettings: ISettings | null = {} as ISettings;

  contextMenuItems: Map<string, IContextMenuItem> = new Map();

  mainButtonItems: Map<string, IMainButtonItem> = new Map();

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

  addMainButtonItem = (item: IMainButtonItem): void => {
    this.mainButtonItems.set(item.key, item);
  };

  getMainButtonItems = (): Map<string, IMainButtonItem> => {
    return this.mainButtonItems;
  };

  updateMainButtonItem = (item: IMainButtonItem): void => {
    this.mainButtonItems.set(item.key, item);
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

const plugin = new Drawio();

declare global {
  interface Window {
    Plugins: any;
  }
}

plugin.setOnLoadCallback(drawIo.onLoad);

plugin.addMainButtonItem(mainButtonItem);
plugin.addFileItem(drawIoItem);
plugin.addContextMenuItem(contextMenuItem);

plugin.setAdminPluginSettings(adminSettings);

window.Plugins.Drawio = plugin || {};

export default plugin;
