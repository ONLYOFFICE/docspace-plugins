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
import {
  saveExitButton,
  saveButton,
  markdownResize,
  previewResize,
  markdownText,
  previewText,
} from "../MarkdownIT/Dialog";
import {
  unsavedText,
  disableWarningCheckbox,
  saveUnsavedButton,
  closeButton,
} from "../MarkdownIT/Unsaved";

import { i18n, I18n } from "./i18n";
export { i18n, I18n };

export const setLocale = (locale: PluginLocale): void => {
  if (i18n.translations[locale]) {
    i18n.locale = locale;
  } else {
    i18n.locale = i18n.defaultLocale;
  }

  saveExitButton.label = i18n.t("dialog.button_save_and_close");
  saveButton.label = i18n.t("dialog.button_save");
  markdownText.text = i18n.t("dialog.text_markdown");
  previewText.text = i18n.t("dialog.text_preview");

  unsavedText.text = i18n.t("unsaved.text");
  disableWarningCheckbox.label = i18n.t("unsaved.checkbox");
  saveUnsavedButton.label = i18n.t("unsaved.button_save_and_close");
  closeButton.label = i18n.t("unsaved.button_close_without_saving");
};
