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

import { Actions, ICreateDialog, IMainButtonItem, IMessage } from "@onlyoffice/docspace-plugin-sdk";
import { supportedFileExts } from "../properties.json";
import codemirror from "../Codemirror";
import { i18n } from "../locales";

let createLock = false;

export const createDialog: ICreateDialog = {
  title: i18n.t("main_button.create_dialog_title"),
  startValue: i18n.t("main_button.create_dialog_start_value"),
  visible: true,
  isCreateDialog: true,
  extension: "",
  isAutoFocusOnError: true,
  isCloseAfterCreate: true,
  isCreateDisabled: false,
  onSave: async (e: any, value: string) => {
    if (createLock) return {};
    else createLock = true;

    if (!value.includes(".")) {
      throw new Error(i18n.t("main_button.error_no_file_ext"));
    }

    if (!supportedFileExts.includes(value.split(".").pop()!)) {
      throw new Error(i18n.t("main_button.error_not_supported"));
    }

    const fileID = await codemirror.createNewFile(value);
    if (typeof fileID === "object") {
      createDialog.isCreateDisabled = true;
      throw new Error(i18n.t("main_button.error_not_created", { title: value, message: fileID.message }));
    }

    const message = await codemirror.openFile(fileID);

    createLock = false;
    return message;
  },
  onError: (e: any) => {
    createLock = false;
    createDialog.errorText = e.message;
    return {
      actions: [Actions.updateCreateDialogModal],
      createDialogProps: createDialog,
    };
  },
  onCancel: (e: any) => {
    codemirror.setCurrentFolderId(null);
  },
  onClose: (e: any) => {
    codemirror.setCurrentFolderId(null);
  },
};

const codemirrorMainButtonItem: () => IMainButtonItem = () => {
  return {
    key: "codemirror-main-button-item",
    label: i18n.t("main_button.label"),
    icon: "codemirror.svg",
    onClick: (id: number) => {
      codemirror.setCurrentFolderId(id);
      createDialog.isCreateDisabled = false;
      createDialog.errorText = "";

      const message: IMessage = {
        actions: [Actions.showCreateDialogModal],
        createDialogProps: createDialog,
      };

      return message;
    },
  };
};

export { codemirrorMainButtonItem };
