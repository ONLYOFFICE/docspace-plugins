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
  FilesExst,
  FilesType,
  IContextMenuItem,
  Security,
} from "@onlyoffice/docspace-plugin-sdk";
import convertFile from "./ConvertFile";
import { i18n } from "./locales";

export const convertFileItem: () => IContextMenuItem = () => {
  return {
    key: "convert-file-item",
    label: i18n.t("context_menu_convert_to_pdf"),
    icon: "convert-16.png",
    onClick: convertFile.onOpenModalDialog,
    fileType: [FilesType.file],
    fileExt: [FilesExst.docx, FilesExst.xlsx, FilesExst.pptx],
    security: [Security.Create],
  };
};
