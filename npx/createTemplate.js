import * as fs from "fs";
import {
  IApiPlugin,
  IContextMenuItem,
  IContextMenuPlugin,
  IPlugin,
  ISeparatorItem,
  ISettings,
  ISettingsPlugin,
  PluginStatus,
  addContextMenuItem,
  adminPluginSettings,
  contextMenuItems,
  getAPI,
  getAdminPluginSettings,
  getContextMenuItems,
  getContextMenuItemsKeys,
  getOrigin,
  getPrefix,
  getProxy,
  getStatus,
  getUserPluginSettings,
  onLoadCallback,
  origin,
  prefix,
  proxy,
  setAPI,
  setAdminPluginSettings,
  setOnLoadCallback,
  setOrigin,
  setPrefix,
  setProxy,
  setUserPluginSettings,
  status,
  updateContextMenuItem,
  updateStatus,
  userPluginSettings,
} from "./constants.js";

const CURR_DIR = process.cwd();

function createTemplate(template, name, pluginName, version, author, scopes) {
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
        newJson.version = version;
        newJson.scopes = scopes;
        newJson.author = author;

        fs.writeFileSync(writePath, JSON.stringify(newJson, null, 2), "utf8");

        break;
      case "webpack.config.js":
        const newConf = contents.replace("default.js", `${pluginName}.js`);

        fs.writeFileSync(writePath, newConf, "utf8");

        break;
      case "index.ts":
        let template = `
import {pluginsImpIns} from '@onlyoffice/docspace-plugin'

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

        let apiVars = "";
        let apiMeth = "";

        if (withApi) {
          pluginsImpIns += `, ${IApiPlugin}`;
          pluginsIns += `, ${IApiPlugin}`;

          apiVars = `
  ${origin}
  ${proxy}
  ${prefix}
          `;

          apiMeth = `
            ${setOrigin}
            ${getOrigin}
            ${setProxy}
            ${getProxy}
            ${setPrefix}
            ${getPrefix}
            ${setAPI}
            ${getAPI}
          `;
        }

        let settingsVars = ``;
        let settingsMeth = ``;

        if (withSettings) {
          pluginsImpIns += `, ${ISettingsPlugin}, ${ISettings} `;
          pluginsIns += `, ${ISettingsPlugin}`;

          settingsVars = `
  ${userPluginSettings}
  ${adminPluginSettings}
          `;

          settingsMeth = `
          ${getUserPluginSettings}
          ${setUserPluginSettings}
          ${getAdminPluginSettings}
          ${setAdminPluginSettings}
          `;
        }

        let contextMenuVars = "";
        let contextMenuMeth = "";

        if (withContextMenu) {
          pluginsImpIns += `, ${IContextMenuPlugin}, ${IContextMenuItem}, ${ISeparatorItem} `;
          pluginsIns += `, ${IContextMenuPlugin}`;

          contextMenuVars = `
  ${contextMenuItems}  
        `;

          contextMenuMeth = `
        ${addContextMenuItem}
        ${getContextMenuItems}
        ${getContextMenuItemsKeys}
        ${updateContextMenuItem}
        `;
        }

        let nameIns = `${pluginName}`;
        let contentIns = `
  ${status}
          ${apiVars}
          ${settingsVars}
          ${contextMenuVars}
          ${onLoadCallback}
          ${updateStatus}
          ${getStatus}
          ${setOnLoadCallback}
          ${apiMeth}
          ${settingsMeth}
          ${contextMenuMeth}
        `;

        template = template
          .replaceAll("pluginsImpIns", pluginsImpIns)
          .replaceAll("PluginsIns", pluginsIns)
          .replaceAll("NameIns", nameIns)
          .replaceAll("contentIns", contentIns);

        fs.writeFileSync(writePath, template, "utf8");

        break;

      case "createZip.js":
        const newCreateZip = contents.replaceAll("PluginName", `${pluginName}`);

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
