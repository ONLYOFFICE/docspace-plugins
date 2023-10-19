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

import * as fs from "fs";
import {
  IPlugin,
  // ISeparatorItem,
  PluginStatus,
  getStatus,
  onLoadCallback,
  setOnLoadCallback,
  status,
  updateStatus,
} from "./constants.js";
import { getApiTemp } from "./helpers/api.js";
import { getSettingsTemp } from "./helpers/settings.js";
import { getContextMenuTemp } from "./helpers/contextMenu.js";
import { getInfoPanelTemp } from "./helpers/infoPanel.js";
import { getMainButtonTemp } from "./helpers/mainButton.js";
import { getProfileMenuTemp } from "./helpers/profileMenu.js";
import { getEventListenerTemp } from "./helpers/eventListeners.js";
import { getFileTemp } from "./helpers/file.js";

const CURR_DIR = process.cwd();

function createTemplate(
  template,
  name,
  pluginName,
  version,
  author,
  logo,
  description,
  license,
  homepage,
  scopes
) {
  const copyActions = [];

  const copyTemplate = async (templatePath, newProjectPath) => {
    const filesToCreate = fs.readdirSync(templatePath);

    filesToCreate.forEach((file) => {
      const origFilePath = `${templatePath}/${file}`;

      // get stats about the current file
      const stats = fs.statSync(origFilePath);

      if (stats.isFile()) {
        copyActions.push(copyFile(file, origFilePath, newProjectPath));
      } else if (stats.isDirectory()) {
        fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

        // recursive call
        copyTemplate(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
      }
    });
  };

  const copyFile = async (file, origFilePath, newProjectPath) => {
    const contents = fs.readFileSync(origFilePath, "utf8");

    const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;

    switch (file) {
      case "package.json":
        const newJson = JSON.parse(contents);

        newJson.name = name;
        newJson.version = version || "";
        newJson.scopes = scopes || [];
        newJson.author = author || "";
        newJson.description = description || "";
        newJson.pluginName = pluginName || "";
        newJson.license = license || "";
        newJson.logo = logo || "";
        newJson.homepage = homepage || "";

        fs.writeFileSync(writePath, JSON.stringify(newJson, null, 2), "utf8");

        break;
      case "index.ts":
        let template = `
import {pluginsImpIns} from '@onlyoffice/docspace-plugin-sdk'

class NameIns implements PluginsIns {
  contentIns
}

const plugin = new NameIns();

declare global {
  interface Window {
    Plugins: any;
  }
}

window.Plugins.NameIns = plugin || {};

export default plugin;
`;

        let pluginsImpIns = `${IPlugin}, ${PluginStatus}`;
        let pluginsIns = `${IPlugin}`;

        const withApi = scopes.includes("API");
        const withSettings = scopes.includes("Settings");
        const withContextMenu = scopes.includes("ContextMenu");
        const withInfoPanel = scopes.includes("InfoPanel");
        const withMainButton = scopes.includes("MainButton");
        const withProfileMenu = scopes.includes("ProfileMenu");
        const withEventListener = scopes.includes("EventListener");
        const withFile = scopes.includes("File");

        const { apiVars, apiMeth, IApiPlugin } = getApiTemp(withApi);
        const { settingsVars, settingsMeth, ISettingsPlugin, ISettings } =
          getSettingsTemp(withSettings);
        const {
          IContextMenuPlugin,
          IContextMenuItem,
          contextMenuVars,
          contextMenuMeth,
        } = getContextMenuTemp(withContextMenu);
        const {
          IInfoPanelPlugin,
          IInfoPanelItem,
          infoPanelVars,
          infoPanelMeth,
        } = getInfoPanelTemp(withInfoPanel);
        const {
          IMainButtonPlugin,
          IMainButtonItem,
          mainButtonVars,
          mainButtonMeth,
        } = getMainButtonTemp(withMainButton);
        const {
          IProfileMenuPlugin,
          IProfileMenuItem,
          profileMenuVars,
          profileMenuMeth,
        } = getProfileMenuTemp(withProfileMenu);
        const {
          IEventListenerPlugin,
          IEventListenerItem,
          eventListenerVars,
          eventListenerMeth,
        } = getEventListenerTemp(withEventListener);
        const { IFilePlugin, IFileItem, fileVars, fileMeth } =
          getFileTemp(withFile);

        if (withApi) {
          pluginsImpIns += `, ${IApiPlugin}`;
          pluginsIns += `, ${IApiPlugin}`;
        }

        if (withSettings) {
          pluginsImpIns += `, ${ISettingsPlugin}, ${ISettings} `;
          pluginsIns += `, ${ISettingsPlugin}`;
        }

        if (withContextMenu) {
          pluginsImpIns += `, ${IContextMenuPlugin}, ${IContextMenuItem} `;
          pluginsIns += `, ${IContextMenuPlugin}`;
        }

        if (withInfoPanel) {
          pluginsImpIns += `, ${IInfoPanelPlugin}, ${IInfoPanelItem} `;
          pluginsIns += `, ${IInfoPanelPlugin}`;
        }

        if (withMainButton) {
          pluginsImpIns += `, ${IMainButtonPlugin}, ${IMainButtonItem} `;
          pluginsIns += `, ${IMainButtonPlugin}`;
        }

        if (withProfileMenu) {
          pluginsImpIns += `, ${IProfileMenuPlugin}, ${IProfileMenuItem} `;
          pluginsIns += `, ${IProfileMenuPlugin}`;
        }

        if (withEventListener) {
          pluginsImpIns += `, ${IEventListenerPlugin}, ${IEventListenerItem} `;
          pluginsIns += `, ${IEventListenerPlugin}`;
        }

        if (withFile) {
          pluginsImpIns += `, ${IFilePlugin}, ${IFileItem} `;
          pluginsIns += `, ${IFilePlugin}`;
        }

        let nameIns = `${pluginName}`;
        let contentIns = `
  ${status}
          ${apiVars}
          ${settingsVars}
          ${contextMenuVars}
          ${infoPanelVars}
          ${mainButtonVars}
          ${profileMenuVars}
          ${eventListenerVars}
          ${fileVars}
          ${onLoadCallback}
          ${updateStatus}
          ${getStatus}
          ${setOnLoadCallback}
          ${apiMeth}
          ${settingsMeth}
          ${contextMenuMeth}
          ${infoPanelMeth}
          ${mainButtonMeth}
          ${profileMenuMeth}
          ${eventListenerMeth}
          ${fileMeth}`;

        template = template
          .replaceAll("pluginsImpIns", pluginsImpIns)
          .replaceAll("PluginsIns", pluginsIns)
          .replaceAll("NameIns", nameIns)
          .replaceAll("contentIns", contentIns);

        const srcDir = writePath.replace("index.ts", "src");

        fs.mkdirSync(srcDir);

        fs.writeFileSync(`${srcDir}/index.ts`, template, "utf8");

        break;

      case "createZip.js":
        const newCreateZip = contents.replaceAll(
          "PluginNameReplace",
          `${pluginName}`
        );

        fs.writeFileSync(writePath, newCreateZip, "utf8");

        break;

      default:
        fs.writeFileSync(writePath, contents, "utf8");
    }
  };

  copyTemplate(template, name);

  return Promise.all(copyActions);
}

export default createTemplate;
