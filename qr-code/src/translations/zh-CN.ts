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
  "contextMenu.label": "获取二维码",
  "infoPanel.tabName": "二维码",
  "modal.header": "共享链接的二维码",
  "hint.header": "扫描二维码即可打开共享链接",
  "hint.body":
    "将手机摄像头对准二维码即可打开此项目。可在“{tab}”选项卡中设置谁可以打开链接，以及访问权限、有效期和密码。",
  "hint.emptyBody":
    "此项目还没有共享链接。请在“{tab}”选项卡中创建，您还可以在那里选择谁可以打开链接，以及权限、有效期和密码。",
  "hint.shareTab": "分享",
  "hint.membersTab": "联系人",
  "error.header": "无法加载链接",
  "error.body":
    "服务器未响应或返回了错误。这通常是短暂的连接问题，点击“重试”即可重新请求链接。如果问题持续存在，也可以在“{tab}”选项卡中找到该链接。",
  "modal.retry": "重试",
  "modal.unsupportedRoom":
    "此类房间没有房间级公共链接。只有公共房间、自定义房间和表单填写空间才有。",
  "modal.copy": "复制链接",
  "modal.copied": "链接已复制到剪贴板",
  "modal.copyFailed": "无法复制链接",
  "modal.close": "关闭",
  "link.create": "创建链接",
  "link.createFailed": "无法创建链接，请稍后重试。",
  "link.anyone": "任何拥有此链接的人",
  "link.internal": "仅限工作区用户",
  "link.password": "受密码保护",
  "link.noTimeLimit": "此链接没有时间限制",
  "link.validUntil": "此链接有效期至 {date}",
  "link.expired": "链接已过期",
  "access.read": "只读",
  "access.edit": "编辑",
  "access.review": "审阅",
  "access.comment": "评论",
  "access.fillForms": "填写",
  "access.customFilter": "自定义过滤条件",
};

export default zhCN;
