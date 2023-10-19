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

const ISettingsPlugin = "ISettingsPlugin";
const ISettings = "ISettings";

// const userPluginSettings = `userPluginSettings: ISettings | null = {} as ISettings;`;
const adminPluginSettings = `adminPluginSettings: ISettings | null = {} as ISettings;`;

// const getUserPluginSettings = `
//   getUserPluginSettings = () => {
//     return this.userPluginSettings;
//   };`;

// const setUserPluginSettings = `
//   setUserPluginSettings = (settings: ISettings | null): void => {
//     this.userPluginSettings = settings;
//   };`;

const getAdminPluginSettings = `  
  getAdminPluginSettings = () => {
    return this.adminPluginSettings;
  };`;

const setAdminPluginSettings = `
  setAdminPluginSettings = (settings: ISettings | null): void => {
    this.adminPluginSettings = settings;
  };`;

export const getSettingsTemp = (withSettings) => {
  if (!withSettings)
    return { settingsVars: "", settingsMeth: "", ISettingsPlugin, ISettings };
  let settingsVars = ``;
  let settingsMeth = ``;

  settingsVars = `
  ${adminPluginSettings}`;

  settingsMeth = `
          ${getAdminPluginSettings}
          ${setAdminPluginSettings}`;

  return { settingsVars, settingsMeth, ISettingsPlugin, ISettings };
};
