/*
 * (c) Copyright Ascensio System SIA 2023
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
  FilesExst,
  FilesType,
  IContextMenuItem,
} from "@onlyoffice/docspace-plugin-sdk";
import drawIo from "../Drawio";

const onClick = async (id: number) => {
  const message = await drawIo.editDiagram(id);

  return message;
};

export const contextMenuItem: IContextMenuItem = {
  key: "drawio-context-menu-item",
  label: "Edit diagram",
  onClick,
  icon: "drawio.svg",
  fileType: [FilesType.image, FilesType.file],
  devices: [Devices.desktop],
  fileExt: [".drawio", ".png"],
};
