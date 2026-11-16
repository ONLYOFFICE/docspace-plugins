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

import type { EmailAddress } from "./types";

export const formatAddress = (a: EmailAddress): string => {
  const name = a.name.trim();
  const address = a.address.trim();
  if (name && address && name !== address) return `${name} <${address}>`;
  return address || name;
};

export const formatAddressList = (list: EmailAddress[]): string =>
  list.map(formatAddress).filter(Boolean).join(", ");

export const formatDate = (date: Date | null, locale: string): string => {
  if (!date || Number.isNaN(date.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(date);
  } catch {
    return date.toLocaleString();
  }
};

export const formatSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
};

/** Standard base64 of raw bytes, in chunks so a multi-megabyte attachment does not blow the call stack. */
export const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
};

/** Windows code page number (as MSG files carry it) to a TextDecoder label. */
export const codepageToLabel = (codepage: number | undefined): string => {
  if (codepage === undefined) return "utf-8";
  if (codepage === 65001) return "utf-8";
  if (codepage === 1200) return "utf-16le";
  if (codepage === 1201) return "utf-16be";
  if (codepage >= 1250 && codepage <= 1258) return `windows-${codepage}`;
  if (codepage >= 28591 && codepage <= 28605) return `iso-8859-${codepage - 28590}`;
  const known: Record<number, string> = {
    20866: "koi8-r",
    21866: "koi8-u",
    932: "shift_jis",
    936: "gbk",
    949: "euc-kr",
    950: "big5",
    874: "windows-874",
  };
  return known[codepage] ?? "utf-8";
};

export const decodeBytes = (bytes: Uint8Array, codepage: number | undefined): string => {
  const label = codepageToLabel(codepage);
  try {
    return new TextDecoder(label).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
};

/** A name safe to hand to the upload endpoint: no path separators, no control characters, never empty. */
export const safeFileName = (name: string, fallback: string): string => {
  const cleaned = name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || fallback;
};
