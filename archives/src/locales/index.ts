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
import { extractButton, cancelButton } from "../ModalDialog";
import en from "../locales/en.json";
import de from "../locales/de.json";
import es from "../locales/es.json";
import fr from "../locales/fr.json";
import it from "../locales/it.json";
import ja from "../locales/ja.json";
import ptBR from "../locales/pt_BR.json";
import ru from "../locales/ru.json";
import zhCN from "../locales/zh_CN.json";

export const i18n = new I18n({
  [PluginLocale.EN_US]: en,
  [PluginLocale.DE]: de,
  [PluginLocale.ES]: es,
  [PluginLocale.FR]: fr,
  [PluginLocale.IT]: it,
  [PluginLocale.JA_JP]: ja,
  [PluginLocale.PT_BR]: ptBR,
  [PluginLocale.RU]: ru,
  [PluginLocale.ZH_CN]: zhCN,
});

i18n.defaultLocale = PluginLocale.EN_US;
i18n.locale = PluginLocale.EN_US;
i18n.enableFallback = true;

export const setLocale = (locale: PluginLocale): void => {
  const next = i18n.translations[locale] ? locale : i18n.defaultLocale;
  if (i18n.locale === next) return;
  i18n.locale = next;

  extractButton.label = i18n.t("dialog.button_extract");
  cancelButton.label = i18n.t("dialog.button_cancel");
};
