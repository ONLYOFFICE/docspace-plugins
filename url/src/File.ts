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

import { IFileItem, File, Devices } from "@onlyoffice/docspace-plugin-sdk";
import urlPlugin from "./Url";
import { i18n } from "./locales";

export const urlFileItem: () => IFileItem = () => ({
  extension: ".url",
  fileTypeName: i18n.t("file_type_name"),
  fileRowIcon: "logo_32x32.svg",
  fileTileIcon: "logo_32x32.svg",
  devices: [Devices.desktop, Devices.mobile, Devices.tablet],
  onClick: (id: File) => urlPlugin.openUrl(id),
});
