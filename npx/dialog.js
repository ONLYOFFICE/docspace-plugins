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

const nameQuestion = {
  name: "plugin-name",
  type: "input",
  message: "Plugin name:",
  validate: function (input) {
    if (/^([a-z\_\-])+$/.test(input)) return true;
    else return "Plugin name may include only letters";
  },
};

const versionQuestion = {
  name: "plugin-version",
  type: "input",
  message: "Plugin version:",
  validate: function (input) {
    if (/[0-9]*\.?[0-9]*/.test(input)) return true;
    else return "Plugin version may include only numbers";
  },
};

const authorQuestion = {
  name: "plugin-author",
  type: "input",
  message: "Plugin author:",
};

const logoQuestion = {
  name: "plugin-logo",
  type: "input",
  message: "Plugin logo:",
};

const descriptionQuestion = {
  name: "plugin-description",
  type: "input",
  message: "Plugin description:",
};

const licenseQuestion = {
  name: "plugin-license",
  type: "input",
  message: "Plugin license:",
};

const homepageQuestion = {
  name: "plugin-homepage",
  type: "input",
  message: "Plugin homepage:",
};

const scopes = [
  { name: "API", value: "API" },
  { name: "Settings", value: "Settings" },
  { name: "Context menu", value: "ContextMenu" },
  { name: "Info panel", value: "InfoPanel" },
  { name: "Main button", value: "MainButton" },
  { name: "Profile menu", value: "ProfileMenu" },
  { name: "Event listener", value: "EventListener" },
  { name: "File action", value: "File" },
];

const scopesQuestion = {
  name: "plugin-scopes",
  type: "checkbox",
  message: "Select scopes (Press <space> to select, Enter when finished):",
  choices: scopes,
};

const QUESTIONS = [
  nameQuestion,
  versionQuestion,
  authorQuestion,
  logoQuestion,
  descriptionQuestion,
  licenseQuestion,
  homepageQuestion,
  scopesQuestion,
];

export default QUESTIONS;
