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

import { Devices, File, FilesType, IContextMenuItem, FilesSecurity, Security } from "@onlyoffice/docspace-plugin-sdk";
import archives from "../Archives";

export const openZipContextMenuItem: IContextMenuItem = {
  key: "archives-open-zip-context-menu-item",
  label: "Open archive",
  onClick: (id: File | any) => archives.openZip(id),
  icon: "zip.svg",
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  fileExt: [".zip"],
  itemSecurity: [FilesSecurity.Edit],
};

const unzipContextMenuItem: IContextMenuItem = {
  key: "archives-unzip-context-menu-item",
  label: "Choose a location",
  onClick: (id: File | any) => archives.openSelector(id),
  icon: "zip.svg",
};

const unzipHereContextMenuItem: IContextMenuItem = {
  key: "archives-unzip-here-context-menu-item",
  label: "Unzip here",
  onClick: (id: number) => archives.unzip(id),
  icon: "zip.svg",
};

export const unzipGroupContextMenuItem: IContextMenuItem = {
  key: "archives-unzip-group-context-menu-item",
  label: "Unzip it",
  icon: "zip.svg",
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  fileExt: [".zip"],
  itemSecurity: [FilesSecurity.Edit],
  items: [
    unzipContextMenuItem,
    unzipHereContextMenuItem,
  ],
}

const zipFolderContextMenuItem: IContextMenuItem = {
  key: "archives-zip-folder-context-menu-item",
  label: "Archive here",
  onClick: (id: number) => archives.zipFolder(id),
  icon: "zip.svg",
};

export const zipGroupContextMenuItem: IContextMenuItem = {
  key: "archives-zip-group-context-menu-item",
  label: "Archive it",
  icon: "zip.svg",
  fileType: [FilesType.folder],
  security: [Security.Create],
  items: [
    zipFolderContextMenuItem,
  ],
}

export const zipSelectedItems: IContextMenuItem = {
  key: "archives-zip-selected-items",
  label: "Archive selected items",
  icon: "zip.svg",
  isGroupAction: true,
  fileType: [FilesType.folder, FilesType.file],
  security: [Security.Create],
  onGroupClick: async (ids) => archives.zipFolder(ids),
}
