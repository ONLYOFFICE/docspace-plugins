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
  FilesType,
  IContextMenuItem,
  FilesSecurity,
  IToast,
  IMessage,
  Actions,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import { urlDialog } from "./Dialog";
import urlPlugin from "./Url";

export const urlContextMenuItem: IContextMenuItem = {
  key: "url",
  label: "Edit Url",
  icon: "logo_16x16.svg",
  fileExt: [".url"],
  fileType: [FilesType.file],
  itemSecurity: [FilesSecurity.Edit, FilesSecurity.Download],
  onClick: async (id: number) => {
    urlPlugin.setCurrentFileId(id);
    const file = await urlPlugin.getFile(id);

    if (typeof file === "string") {
      return {
        actions: [Actions.showToast],
        toastProps: [
          {
            type: ToastType.error,
            title: file,
          } as IToast,
        ],
      } as IMessage;
    }

    const url = file.data
      .split("\n")
      .filter((line) => line.startsWith("URL="))[0]
      .split("=")[1];

    return {
      actions: [Actions.showModal],
      modalDialogProps: urlDialog(true, url, file.info.title.replace(/\.url$/i, "")),
    };
  },
};
