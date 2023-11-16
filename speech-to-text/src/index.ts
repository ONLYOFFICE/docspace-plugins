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
} from "@onlyoffice/docspace-plugin-sdk";
import { contextMenuItem } from "./ContextMenuItem";
import assemblyAI from "./AssemblyAI";
import { adminSettings } from "./Settings";

class SpeechToText
  implements IPlugin, IApiPlugin, ISettingsPlugin, IContextMenuPlugin
{
  status: PluginStatus = PluginStatus.hide;

  origin = "";
  proxy = "";
  prefix = "";

  userPluginSettings: ISettings | null = {} as ISettings;
  adminPluginSettings: ISettings | null = {} as ISettings;

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

  setAdminPluginSettingsValue = (settings: string | null): void => {
    if (settings) assemblyAI.setAPIToken(settings);
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
}

const plugin = new SpeechToText();

plugin.addContextMenuItem(contextMenuItem);
plugin.setAdminPluginSettings(adminSettings);

declare global {
  interface Window {
    Plugins: any;
  }
}

window.Plugins.SpeechToText = plugin || {};

export default plugin;
