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

import { PluginLocale } from "@onlyoffice/docspace-plugin-sdk";
import { acceptButtonProps, cancelButtonProps } from "../OpenFromUrlDialog/button";
import { descTextProps } from "../OpenFromUrlDialog/index";
import { nameInputProps, inputTextProps } from "../OpenFromUrlDialog/Name";
import { urlInputProps } from "../OpenFromUrlDialog/Url";

import { i18n } from "./i18n";
export { i18n };

export const setLocale = (locale: PluginLocale): void => {
  const next = i18n.translations[locale] ? locale : i18n.defaultLocale;
  if (i18n.locale === next) return;
  i18n.locale = next;

  acceptButtonProps.label = i18n.t("open_from_url.button_accept");
  cancelButtonProps.label = i18n.t("open_from_url.button_cancel");
  descTextProps.text = i18n.t("open_from_url.description_text");
  nameInputProps.placeholder = i18n.t("open_from_url.input_placeholder");
  inputTextProps.text = i18n.t("open_from_url.input_text_name");
  urlInputProps.placeholder = i18n.t("open_from_url.input_placeholder_url");
};
