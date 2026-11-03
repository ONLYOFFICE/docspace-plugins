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

import ru from "./translations/ru";

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
  "hint.header": string;
  "hint.body": string;
  "hint.emptyBody": string;
  "hint.shareTab": string;
  "hint.membersTab": string;
  "error.header": string;
  "error.body": string;
  "modal.retry": string;
  "modal.unsupportedRoom": string;
  "modal.copy": string;
  "modal.copied": string;
  "modal.copyFailed": string;
  "modal.close": string;
  "link.create": string;
  "link.createFailed": string;
  "link.anyone": string;
  "link.internal": string;
  "link.password": string;
  "link.noTimeLimit": string;
  "link.validUntil": string;
  "link.expired": string;
  "access.read": string;
  "access.edit": string;
  "access.review": string;
  "access.comment": string;
  "access.fillForms": string;
  "access.customFilter": string;
};

const en: TStrings = {
  "contextMenu.label": "Get QR code",
  "infoPanel.tabName": "QR code",
  "modal.header": "QR code for the shared link",
  "hint.header": "The QR code opens the shared link",
  "hint.body":
    "Point a phone camera at the code to open this item. Who can open the link, its access rights, expiration and password are set on the {tab} tab.",
  "hint.emptyBody":
    "This item has no shared link yet. Create it on the {tab} tab, where you also choose who can open it, its rights, expiration and password.",
  "hint.shareTab": "Share",
  "hint.membersTab": "Contacts",
  "error.header": "Couldn't load the link",
  "error.body":
    "The server didn't answer or returned an error. This is usually a short connection problem, so Try again requests the link once more. If it keeps failing, the link is also on the {tab} tab.",
  "modal.retry": "Try again",
  "modal.unsupportedRoom":
    "This room type has no room-level public link. Only a Public room, a Custom room and a Form Filling Space have one.",
  "modal.copy": "Copy link",
  "modal.copied": "Link copied to clipboard",
  "modal.copyFailed": "Couldn't copy the link",
  "modal.close": "Close",
  "link.create": "Create link",
  "link.createFailed": "Couldn't create the link. Try again later.",
  "link.anyone": "Anyone with the link",
  "link.internal": "Workspace users only",
  "link.password": "Password protected",
  "link.noTimeLimit": "This link has no time limit",
  "link.validUntil": "This link is valid until {date}",
  "link.expired": "The link has expired",
  "access.read": "Read only",
  "access.edit": "Editing",
  "access.review": "Review",
  "access.comment": "Comment",
  "access.fillForms": "Filling",
  "access.customFilter": "Custom filter",
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
  t(key).replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in values ? String(values[name]) : whole,
  );
