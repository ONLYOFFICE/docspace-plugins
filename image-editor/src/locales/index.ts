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
import { saveExitButton } from "../Dialog";

import { i18n } from "./i18n";
export { i18n };

export const setLocale = (locale: PluginLocale): void => {
  const next = i18n.translations[locale] ? locale : i18n.defaultLocale;
  if (i18n.locale === next) return;
  i18n.locale = next;

  saveExitButton.label = i18n.t("dialog_button_save_and_exit");
};
