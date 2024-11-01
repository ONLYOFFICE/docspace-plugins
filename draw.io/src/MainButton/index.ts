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
  Actions,
  IMainButtonItem,
  IMessage,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import drawIo from "../Drawio";
// import { openFromUrlProps } from "../OpenFromUrlDialog";

// const createItem: IMainButtonItem = {
//   key: "draw-io-main-button-item_create",
//   label: "Create new",
//   icon: "create-new.svg",
//   onClick: (id: number) => {
//     drawIo.setCurrentFolderId(id);

//     const message: IMessage = {
//       actions: [Actions.showCreateDialogModal],
//       createDialogProps: {
//         title: "Create diagram",
//         startValue: "New diagram",
//         visible: true,
//         isCreateDialog: true,
//         extension: ".drawio",
//         onSave: async (e: any, value: string) => {
//           await drawIo.createNewFile(value);
//         },
//         onCancel: (e: any) => {
//           drawIo.setCurrentFolderId(null);
//         },
//         onClose: (e: any) => {
//           drawIo.setCurrentFolderId(null);
//         },
//       },
//     };

//     return message;
//   },
// };

// const openItem: IMainButtonItem = {
//   key: "draw-io-main-button-item_open",
//   label: "Open from URL",
//   icon: "open-drawio.svg",
//   onClick: (id) => {
//     drawIo.setCurrentFolderId(id);

//     const message: IMessage = {
//       actions: [Actions.showModal],
//       modalDialogProps: openFromUrlProps,
//     };

//     return message;
//   },
// };

let createLock = false;

const mainButtonItem: IMainButtonItem = {
  key: "draw-io-main-button-item",
  label: "Draw.io",
  icon: "drawio.svg",
  onClick: (id: number) => {
    drawIo.setCurrentFolderId(id);

    const message: IMessage = {
      actions: [Actions.showCreateDialogModal],
      createDialogProps: {
        title: "Create diagram",
        startValue: "New diagram",
        visible: true,
        isCreateDialog: true,
        extension: ".drawio",
        onSave: async (e: any, value: string) => {
          if (createLock) return {};
          else createLock = true;
          const id = await drawIo.createNewFile(value);
          if (typeof id === 'object') {
            const m: IMessage = {
              actions: [Actions.closeModal, Actions.showToast],
              toastProps: [
                {
                  type: ToastType.error,
                  title: `File "${value}.drawio" was not created: ${id.message}`,
                },
              ]
            }

            createLock = false;
            return m;
          }

          createLock = false;
          return await drawIo.editDiagram(id);
        },
        onCancel: (e: any) => {
          drawIo.setCurrentFolderId(null);
        },
        onClose: (e: any) => {
          drawIo.setCurrentFolderId(null);
        },
      },
    };

    return message;
  },
  // items: [createItem],
};

export { mainButtonItem };
