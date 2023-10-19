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
  IModalDialog,
  IBox,
  Components,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";

import { nameGroup } from "./Name";
import { buttonGroup, onCancelClick } from "./button";

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [nameGroup, { component: Components.box, props: buttonGroup }],
};

export const convertFileDialog: IModalDialog = {
  dialogHeader: "Convert file to PDF",
  dialogBody: parentBox,
  displayType: ModalDisplayType.modal,
  autoMaxHeight: true,
  onClose: onCancelClick,
  onLoad: async () => {
    return { newDialogHeader: "Convert file to PDF", newDialogBody: parentBox };
  },
};
