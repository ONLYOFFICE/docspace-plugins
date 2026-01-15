/*
 * (c) Copyright Ascensio System SIA 2025
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

import { I18n } from "i18n-js";
import { PluginLocale } from "@onlyoffice/docspace-plugin-sdk";
import enUS from "../locales/en-US.json";
import { acceptButtonProps, cancelButtonProps } from "../OpenFromUrlDialog/button";
import { descTextProps } from "../OpenFromUrlDialog/index";
import { nameInputProps, inputTextProps } from "../OpenFromUrlDialog/Name";
import { urlInputProps } from "../OpenFromUrlDialog/Url";

export const i18n = new I18n({
  [PluginLocale.EN_US]: enUS,
});

i18n.defaultLocale = PluginLocale.EN_US;
i18n.locale = PluginLocale.EN_US;
i18n.enableFallback = true;

export const setLocale = (locale: PluginLocale): void => {
  if (i18n.translations[locale]) {
    i18n.locale = locale;
  } else {
    i18n.locale = i18n.defaultLocale;
  }

  acceptButtonProps.label = i18n.t("open_from_url.button_accept");
  cancelButtonProps.label = i18n.t("open_from_url.button_cancel");
  descTextProps.text = i18n.t("open_from_url.description_text");
  nameInputProps.placeholder = i18n.t("open_from_url.input_placeholder");
  inputTextProps.text = i18n.t("open_from_url.input_text_name");
  urlInputProps.placeholder = i18n.t("open_from_url.input_placeholder_url");
};

export { I18n };
