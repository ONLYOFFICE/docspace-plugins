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
  "contextMenu.label": "QRコードを取得",
  "infoPanel.tabName": "QRコード",
  "modal.header": "共有リンクのQRコード",
  "hint.header": "QRコードで共有リンクが開きます",
  "hint.body":
    "スマートフォンのカメラをコードに向けると、この項目が開きます。リンクを開けるユーザー、アクセス権限、有効期限、パスワードは「{tab}」タブで設定できます。",
  "hint.emptyBody":
    "この項目にはまだ共有リンクがありません。「{tab}」タブでリンクを作成してください。リンクを開けるユーザー、権限、有効期限、パスワードもそこで設定できます。",
  "hint.shareTab": "シェア",
  "hint.membersTab": "連絡先",
  "error.header": "リンクを読み込めませんでした",
  "error.body":
    "サーバーから応答がないか、エラーが返されました。通常は一時的な接続の問題のため、「もう一度試す」でリンクを再度リクエストできます。問題が解決しない場合は、「{tab}」タブでもリンクを確認できます。",
  "modal.retry": "もう一度試す",
  "modal.unsupportedRoom":
    "この種類のルームには、ルーム単位の公開リンクがありません。公開リンクがあるのは、パブリックルーム、カスタムルーム、フォーム記入スペースのみです。",
  "modal.copy": "リンクをコピーする",
  "modal.copied": "リンクがクリップボードにコピーされました",
  "modal.copyFailed": "リンクをコピーできませんでした",
  "modal.close": "クローズ",
  "link.create": "リンクを作成する",
  "link.createFailed": "リンクを作成できませんでした。後でもう一度お試しください。",
  "link.anyone": "リンクを持っている人",
  "link.internal": "ワークスペースユーザーのみ",
  "link.password": "パスワードで保護",
  "link.noTimeLimit": "このリンクには時間制限がありません",
  "link.validUntil": "このリンクは{date}まで有効です",
  "link.expired": "リンクの有効期限が切れています",
  "access.read": "読み取り専用",
  "access.edit": "編集",
  "access.review": "レビュー",
  "access.comment": "コメント",
  "access.fillForms": "記入",
  "access.customFilter": "カスタムフィルター",
};

export default jaJP;
