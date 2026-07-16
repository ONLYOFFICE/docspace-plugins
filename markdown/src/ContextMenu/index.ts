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

import {
  Devices,
  FilesType,
  IContextMenuItem,
  FilesSecurity,
} from "@onlyoffice/docspace-plugin-sdk";
import markdownIt from "../Markdownit";
import { i18n } from "../locales";

const onClick = async (id: number) => {
  const message = await markdownIt.editMarkdown(id, false);

  return message;
};

const onViewClick = async (id: number) => {
  const message = await markdownIt.editMarkdown(id, true);

  return message;
};

export const contextMenuItem: () => IContextMenuItem = () => {
  return {
    key: "markdownit-context-menu-item",
    label: i18n.t("context_menu_item.edit_markdown"),
    onClick,
    icon: "markdown.svg",
    fileType: [FilesType.file],
    devices: [Devices.desktop, Devices.mobile, Devices.tablet],
    fileExt: [".md"],
    itemSecurity: [FilesSecurity.Edit],
  };
};

export const contextMenuViewerItem: () => IContextMenuItem = () => {
  return {
    key: "markdownit-context-menu-viewer-item",
    label: i18n.t("context_menu_item.preview_markdown"),
    onClick: onViewClick,
    icon: "view.svg",
    fileType: [FilesType.file],
    devices: [Devices.desktop, Devices.mobile, Devices.tablet],
    fileExt: [".md"],
  };
};
