/*
 * (c) Copyright Ascensio System SIA 2024
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

import markdownIt from "../Markdownit";

const onClick = async (item: File) => {
  return await markdownIt.editMarkdown(item.id, false);
};

export const markdownitItem: IFileItem = {
  extension: ".md",
  fileTypeName: "Markdown",
  fileRowIcon: "markdown.svg",
  fileTileIcon: "markdown.svg",
  devices: [Devices.desktop],
  onClick,
};
