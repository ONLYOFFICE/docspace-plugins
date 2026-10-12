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

import drawIo from "../../Drawio";

import { urlInput, urlGroup, urlText, urlDescriptionText } from "./Url";
import { langComboBox, langGroup, options, langText } from "./Lang";
import { offGroup, offToggleButtonProps, offDescriptionBox, offText, textProps } from "./Off";
import { libGroup, libToggleButtonProps, libText } from "./Lib";
import { adminButtonComponent, adminButtonProps } from "./Button";
import { i18n } from "../../locales";

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  marginProp: "16 0 0 0",
  children: [
    urlGroup,
    langGroup,
    offGroup,
    { component: Components.box, props: { ...offDescriptionBox } },
    libGroup,
  ],
};

const adminSettings: ISettings = {
  settings: parentBox,
  saveButton: adminButtonComponent,
  onLoad: async () => {
    urlInput.value = drawIo.adminSettings.url;
    urlInput.hasError = false;
    langComboBox.selectedOption = options.find(
      (o) => o.key === drawIo.adminSettings.lang
    ) || {
      key: "auto",
      label: "Auto",
    };
    offToggleButtonProps.isChecked = drawIo.adminSettings.off;
    libToggleButtonProps.isChecked = drawIo.adminSettings.lib;

    adminButtonProps.label = i18n.t("settings.button_save");
    urlText.text = i18n.t("settings.text_url");
    urlDescriptionText.text = i18n.t("settings.text_url_description");
    langText.text = i18n.t("settings.text_language");
    libText.text = i18n.t("settings.text_libraries");
    offText.text = i18n.t("settings.text_offline");
    textProps.text = i18n.t("settings.text_offline_description");

    return { settings: parentBox };
  },
};

export { adminSettings };
