/*
 * (c) Copyright Ascensio System SIA 2025
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
  FilesSecurity,
  FilesType,
  IContextMenuItem,
  Security,
} from "@onlyoffice/docspace-plugin-sdk";
import convertFile from "./ConvertFile";

export const convertFileItem: IContextMenuItem = {
  key: "convert-to-markdown-item",
  label: "Convert to Markdown",
  icon: "icon-md.png",
  onClick: convertFile.onConvertToMarkdown,
  fileType: [FilesType.file],
  fileExt: [
    FilesExst.docx,
    FilesExst.txt,
    ".html",
  ],
  security: [Security.Create],
  itemSecurity: [FilesSecurity.Download],
};
