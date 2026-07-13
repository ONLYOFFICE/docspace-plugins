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
  Actions,
  IMainButtonItem,
  IMessage,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import markdownIt from "../Markdownit";
import { i18n } from "../locales";

let createLock = false;

const mainButtonItem: () => IMainButtonItem = () => {
  return {
    key: "markdown-it-main-button-item",
    label: i18n.t("main_button.markdown"),
    icon: "markdown.svg",
    onClick: (id: number) => {
      markdownIt.setCurrentFolderId(id);

      const message: IMessage = {
        actions: [Actions.showCreateDialogModal],
        createDialogProps: {
          title: i18n.t("main_button.dialog_create_markdown"),
          startValue: "Markdown file",
          visible: true,
          isCreateDialog: true,
          extension: ".md",
          onSave: async (e: any, value: string) => {
            if (createLock) return {};
            else createLock = true;
            const fileID = await markdownIt.createNewFile(value);
            if (typeof fileID === "object") {
              const m: IMessage = {
                actions: [Actions.closeModal, Actions.showToast],
                toastProps: [
                  {
                    type: ToastType.error,
                    title: i18n.t("main_button.toast_file_not_created", { title: value, message: fileID.message }),
                  },
                ],
              };

              createLock = false;
              return m;
            }

            const message = await markdownIt.editMarkdown(fileID, false);

            createLock = false;
            return message;
          },
          onCancel: (e: any) => {
            markdownIt.setCurrentFolderId(null);
          },
          onClose: (e: any) => {
            markdownIt.setCurrentFolderId(null);
          },
        },
      };

      return message;
    },
  };
};

export { mainButtonItem };
