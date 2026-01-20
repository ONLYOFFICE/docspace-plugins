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

import { I18n } from "i18n-js";
import { PluginLocale } from "@onlyoffice/docspace-plugin-sdk";
import { saveButton, cancelButton } from "../Dialog/index";
import { continueButton, reopenButton, unsavedText } from "../Dialog/Unsaved";
import { createDialog } from "../MainButton/index";
import enUS from "../locales/en-US.json";

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

  saveButton.label = i18n.t("dialog.button_save");
  cancelButton.label = i18n.t("dialog.button_cancel");
  continueButton.label = i18n.t("dialog.button_continue");
  reopenButton.label = i18n.t("dialog.button_reopen");
  unsavedText.text = i18n.t("dialog.text_unsaved");
  createDialog.title = i18n.t("main_button.create_dialog_title");
  createDialog.startValue = i18n.t("main_button.create_dialog_start_value");
};

export { I18n };
