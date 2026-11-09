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

const zhCN: TStrings = {
  "file.typeName": "电子邮件",
  "header.from": "发件人",
  "header.to": "收件人",
  "header.cc": "抄送",
  "header.bcc": "密送",
  "header.date": "日期",
  "subject.empty": "（无主题）",
  "body.empty": "此邮件没有文本内容。",
  "body.title": "邮件正文",
  "attachments.title": "附件（{count}）",
  "attachments.save": "保存到此文件夹",
  "attachments.saveAll": "全部保存",
  "images.blocked": "为保护您的隐私，已阻止加载远程图片。",
  "images.load": "加载图片",
  "images.hide": "隐藏图片",
  "toast.saved": "已将 {name} 保存到当前文件夹",
  "toast.savedAll": "已将 {count} 个附件保存到当前文件夹",
  "toast.saveFailed": "无法保存 {name}",
  "toast.saveFailedSome": "{total} 个附件中有 {failed} 个无法保存",
  "state.loading": "正在加载邮件…",
  "state.empty": "此文件为空。",
  "state.loadFailed": "无法加载文件。",
  "state.parseFailed": "无法读取此邮件。文件可能已损坏，或不是电子邮件。",
  "state.noFile": "未选择文件。",
};

export default zhCN;
