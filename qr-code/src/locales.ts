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
 *
 * Add one key per user-visible string as the items are written. t() accepts only
 * keys listed here, which is the point - a label that was never translated fails
 * the build rather than rendering blank in the portal. Components call t() at
 * render time, so they pick the current language up on their own.
 */
export type TStrings = {
  "contextMenu.label": string;
  "infoPanel.tabName": string;
  "modal.header": string;
  "modal.error": string;
  "modal.noLink": string;
  "modal.unsupportedRoom": string;
  "modal.copy": string;
  "modal.copied": string;
  "modal.copyFailed": string;
  "modal.close": string;
};

const en: TStrings = {
  "contextMenu.label": "Get QR code",
  "infoPanel.tabName": "QR code",
  "modal.header": "QR code for the public link",
  "modal.error": "Couldn't load the public link.",
  "modal.noLink": "This item has no public link yet. Create one from the sharing settings first.",
  "modal.unsupportedRoom": "This room type has no room-level public link. Only Public, Custom and Form filling rooms do.",
  "modal.copy": "Copy link",
  "modal.copied": "Link copied to clipboard",
  "modal.copyFailed": "Couldn't copy the link",
  "modal.close": "Close",
};

const ru: TStrings = {
  "contextMenu.label": "Получить QR-код",
  "infoPanel.tabName": "QR-код",
  "modal.header": "QR-код публичной ссылки",
  "modal.error": "Не удалось загрузить публичную ссылку.",
  "modal.noLink": "У этого объекта ещё нет публичной ссылки. Сначала создайте её в настройках доступа.",
  "modal.unsupportedRoom": "У этого типа комнаты нет публичной ссылки на уровне комнаты. Она есть только у публичных, пользовательских комнат и комнат для заполнения форм.",
  "modal.copy": "Скопировать ссылку",
  "modal.copied": "Ссылка скопирована в буфер обмена",
  "modal.copyFailed": "Не удалось скопировать ссылку",
  "modal.close": "Закрыть",
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
 * t() with placeholders: tf("room.renamed", { title }) fills every {title} in the string.
 * A missing value is left as the placeholder rather than printing "undefined".
 */
export const tf = (key: keyof TStrings, values: Record<string, string | number>): string =>
  t(key).replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole));
