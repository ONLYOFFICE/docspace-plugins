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

// import { IBox, ISettings, SettingsType } from "@onlyoffice/docspace-plugin-sdk";

// import drawIo from "../../Drawio";
// import plugin from "../..";

// import { userAcceptGroup } from "./Button";
// import { themeGroup, themeOptions, themeComboBox } from "./Theme";
// import { darkGroup, darkOptions, darkComboBox } from "./Dark";

// const parentBox: IBox = {
//   displayProp: "flex",
//   flexDirection: "column",
//   marginProp: "16 0 0 0",
//   children: [themeGroup, darkGroup, userAcceptGroup],
// };

// const userSettings: ISettings = {
//   type: SettingsType.settingsPage,

//   customSettings: parentBox,
//   onLoad: async () => {
//     const userSettingsVal = drawIo.fetchAdminSettings();

//     if (!userSettingsVal) return { customSettings: parentBox };

//     themeComboBox.selectedOption = themeOptions.find(
//       (o) => o.key === drawIo.userSettings.theme
//     ) || { key: "default", label: "Default" };

//     darkComboBox.selectedOption = darkOptions.find(
//       (o) => o.key === drawIo.userSettings.dark
//     ) || {
//       key: "auto",
//       label: "Auto",
//     };

//     plugin.setUserPluginSettings(userSettings);

//     return { customSettings: parentBox };
//   },
// };

// export { userSettings };
