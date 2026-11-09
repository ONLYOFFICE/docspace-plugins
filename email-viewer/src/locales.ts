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

import arSA from "./translations/ar-SA";
import az from "./translations/az";
import bg from "./translations/bg";
import cs from "./translations/cs";
import de from "./translations/de";
import elGR from "./translations/el-GR";
import es from "./translations/es";
import fi from "./translations/fi";
import fr from "./translations/fr";
import hyAM from "./translations/hy-AM";
import it from "./translations/it";
import jaJP from "./translations/ja-JP";
import koKR from "./translations/ko-KR";
import loLA from "./translations/lo-LA";
import lv from "./translations/lv";
import nl from "./translations/nl";
import pl from "./translations/pl";
import pt from "./translations/pt";
import ptBR from "./translations/pt-BR";
import ro from "./translations/ro";
import ru from "./translations/ru";
import si from "./translations/si";
import sk from "./translations/sk";
import sl from "./translations/sl";
import sqAL from "./translations/sq-AL";
import srCyrlRS from "./translations/sr-Cyrl-RS";
import srLatnRS from "./translations/sr-Latn-RS";
import tr from "./translations/tr";
import ukUA from "./translations/uk-UA";
import vi from "./translations/vi";
import zhCN from "./translations/zh-CN";

/**
 * Plain typed strings rather than an i18n library: the bundle stays small and a
 * missing key is a compile error instead of a blank label at runtime.
 */
export type TStrings = {
  "file.typeName": string;
  "header.from": string;
  "header.to": string;
  "header.cc": string;
  "header.bcc": string;
  "header.date": string;
  "subject.empty": string;
  "body.empty": string;
  "body.title": string;
  "attachments.title": string;
  "attachments.save": string;
  "attachments.saveAll": string;
  "images.blocked": string;
  "images.load": string;
  "images.hide": string;
  "toast.saved": string;
  "toast.savedAll": string;
  "toast.saveFailed": string;
  "toast.saveFailedSome": string;
  "state.loading": string;
  "state.empty": string;
  "state.loadFailed": string;
  "state.parseFailed": string;
  "state.noFile": string;
};

const en: TStrings = {
  "file.typeName": "Email message",
  "header.from": "From",
  "header.to": "To",
  "header.cc": "Cc",
  "header.bcc": "Bcc",
  "header.date": "Date",
  "subject.empty": "(no subject)",
  "body.empty": "This message has no text.",
  "body.title": "Message body",
  "attachments.title": "Attachments ({count})",
  "attachments.save": "Save to this folder",
  "attachments.saveAll": "Save all",
  "images.blocked": "Remote images are blocked to protect your privacy.",
  "images.load": "Load images",
  "images.hide": "Hide images",
  "toast.saved": "{name} saved to the current folder",
  "toast.savedAll": "{count} attachments saved to the current folder",
  "toast.saveFailed": "Couldn't save {name}",
  "toast.saveFailedSome": "{failed} of {total} attachments couldn't be saved",
  "state.loading": "Loading message…",
  "state.empty": "This file is empty.",
  "state.loadFailed": "Couldn't load the file.",
  "state.parseFailed": "Couldn't read this message. The file may be damaged or not an email.",
  "state.noFile": "No file is selected.",
};

/**
 * Keyed by PluginLocale, not by a string: the portal passes the enum's own value to
 * setLanguage, and a table filed under anything else is never found. Every locale is
 * listed, so a language the SDK adds fails the build until it is translated.
 */
const translations: Record<PluginLocale, TStrings> = {
  [PluginLocale.AR_SA]: arSA,
  [PluginLocale.AZ]: az,
  [PluginLocale.BG]: bg,
  [PluginLocale.CS]: cs,
  [PluginLocale.DE]: de,
  [PluginLocale.EL_GR]: elGR,
  [PluginLocale.EN_GB]: en,
  [PluginLocale.EN_US]: en,
  [PluginLocale.ES]: es,
  [PluginLocale.FI]: fi,
  [PluginLocale.FR]: fr,
  [PluginLocale.HY_AM]: hyAM,
  [PluginLocale.IT]: it,
  [PluginLocale.JA_JP]: jaJP,
  [PluginLocale.KO_KR]: koKR,
  [PluginLocale.LO_LA]: loLA,
  [PluginLocale.LV]: lv,
  [PluginLocale.NL]: nl,
  [PluginLocale.PL]: pl,
  [PluginLocale.PT]: pt,
  [PluginLocale.PT_BR]: ptBR,
  [PluginLocale.RO]: ro,
  [PluginLocale.RU]: ru,
  [PluginLocale.SI]: si,
  [PluginLocale.SK]: sk,
  [PluginLocale.SL]: sl,
  [PluginLocale.SQ_AL]: sqAL,
  [PluginLocale.SR_CYRL_RS]: srCyrlRS,
  [PluginLocale.SR_LATN_RS]: srLatnRS,
  [PluginLocale.TR]: tr,
  [PluginLocale.UK_UA]: ukUA,
  [PluginLocale.VI]: vi,
  [PluginLocale.ZH_CN]: zhCN,
};

let locale: PluginLocale = PluginLocale.EN_US;

export const setLocale = (next: PluginLocale): void => {
  locale = translations[next] ? next : PluginLocale.EN_US;
};

export const currentLocale = (): PluginLocale => locale;

export const t = (key: keyof TStrings): string => (translations[locale] ?? en)[key];

/**
 * t() with placeholders: tf("attachments.title", { count }) fills every {count} in the string.
 * A missing value is left as the placeholder rather than printing "undefined".
 */
export const tf = (key: keyof TStrings, values: Record<string, string | number>): string =>
  t(key).replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in values ? String(values[name]) : whole,
  );
