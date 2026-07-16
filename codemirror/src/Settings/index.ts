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

import { Components, IBox, ISettings } from "@onlyoffice/docspace-plugin-sdk";
import {
  autoCloseTagsSetting,
  autoCloseTagsToggle,
  highlightTrailingWhitespaceSetting,
  highlightTrailingWhitespaceToggle,
  highlightWhitespaceSetting,
  highlightWhitespaceToggle,
} from "./Core";
import { settingsButtonComponent, settingsButtonProps } from "./Button";
import codemirror from "../Codemirror";
import { createSettingsHeader } from "./Utils";
import { i18n } from "../locales";

const settingsBox: () => IBox = () => {
  return {
    displayProp: "flex",
    flexDirection: "column",
    marginProp: "16 0 0 0",
    children: [
      createSettingsHeader(i18n.t("settings.header_general")),
      { component: Components.box, props: highlightWhitespaceSetting() },
      { component: Components.box, props: highlightTrailingWhitespaceSetting() },
      createSettingsHeader(i18n.t("settings.header_html")),
      { component: Components.box, props: autoCloseTagsSetting() },
    ],
  };
};

const codemirrorSettings: ISettings = {
  settings: settingsBox(),
  saveButton: settingsButtonComponent,
  onLoad: async () => {
    highlightWhitespaceToggle.isChecked = codemirror.settings.highlightWhitespace;
    highlightTrailingWhitespaceToggle.isChecked = codemirror.settings.highlightTrailingWhitespace;
    autoCloseTagsToggle.isChecked = codemirror.settings.autoCloseTags;

    settingsButtonProps.label = i18n.t("settings.button_save");

    return { settings: settingsBox() };
  },
};

export { codemirrorSettings };
