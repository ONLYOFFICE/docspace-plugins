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

const ru: TStrings = {
  "file.typeName": "Почтовое сообщение",
  "header.from": "От",
  "header.to": "Кому",
  "header.cc": "Копия",
  "header.bcc": "Скрытая копия",
  "header.date": "Дата",
  "subject.empty": "(без темы)",
  "body.empty": "В этом сообщении нет текста.",
  "body.title": "Текст сообщения",
  "attachments.title": "Вложения ({count})",
  "attachments.save": "Сохранить в эту папку",
  "attachments.saveAll": "Сохранить все",
  "images.blocked": "Внешние изображения заблокированы для защиты приватности.",
  "images.load": "Загрузить изображения",
  "images.hide": "Скрыть изображения",
  "toast.saved": "{name} сохранён в текущую папку",
  "toast.savedAll": "Вложений сохранено в текущую папку: {count}",
  "toast.saveFailed": "Не удалось сохранить {name}",
  "toast.saveFailedSome": "Не удалось сохранить {failed} из {total} вложений",
  "state.loading": "Загрузка сообщения…",
  "state.empty": "Файл пуст.",
  "state.loadFailed": "Не удалось загрузить файл.",
  "state.parseFailed": "Не удалось прочитать сообщение. Файл повреждён или не является письмом.",
  "state.noFile": "Файл не выбран.",
};

/**
 * Keyed by PluginLocale, not by a string: the portal passes the enum's own value to
 * setLanguage, and a table filed under anything else is never found.
 */
const translations: Partial<Record<PluginLocale, TStrings>> = {
  [PluginLocale.EN_US]: en,
  [PluginLocale.RU]: ru,
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
