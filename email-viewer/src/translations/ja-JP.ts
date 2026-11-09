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

import type { TStrings } from "../locales";

const jaJP: TStrings = {
  "file.typeName": "メールメッセージ",
  "header.from": "差出人",
  "header.to": "宛先",
  "header.cc": "CC",
  "header.bcc": "BCC",
  "header.date": "日付",
  "subject.empty": "(件名なし)",
  "body.empty": "このメッセージには本文がありません。",
  "body.title": "メッセージ本文",
  "attachments.title": "添付ファイル ({count})",
  "attachments.save": "このフォルダーに保存",
  "attachments.saveAll": "すべて保存",
  "images.blocked": "プライバシー保護のため、外部画像はブロックされています。",
  "images.load": "画像を読み込む",
  "images.hide": "画像を非表示",
  "toast.saved": "{name} を現在のフォルダーに保存しました",
  "toast.savedAll": "{count} 件の添付ファイルを現在のフォルダーに保存しました",
  "toast.saveFailed": "{name} を保存できませんでした",
  "toast.saveFailedSome": "{total} 件中 {failed} 件の添付ファイルを保存できませんでした",
  "state.loading": "メッセージを読み込んでいます…",
  "state.empty": "このファイルは空です。",
  "state.loadFailed": "ファイルを読み込めませんでした。",
  "state.parseFailed":
    "このメッセージを読み取れませんでした。ファイルが破損しているか、メールではない可能性があります。",
  "state.noFile": "ファイルが選択されていません。",
};

export default jaJP;
