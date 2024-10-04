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
  Components,
  IBox,
  IFrame,
  IMessage,
  IModalDialog,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";

export const frameProps: IFrame = {
  width: "100%",
  height: "100%",
  name: "test-drawio",
  src: "",
};

const body: IBox = {
  widthProp: "100%",
  heightProp: "100%",

  children: [
    {
      component: Components.iFrame,
      props: frameProps,
    },
  ],
};

export const drawIoModalDialogProps: IModalDialog = {
  dialogHeader: "",
  dialogBody: body,
  displayType: ModalDisplayType.modal,
  fullScreen: true,
  onClose: () => {
    const message: IMessage = {
      actions: [Actions.closeModal],
    };

    return message;
  },
  onLoad: async () => {
    return {
      newDialogHeader: drawIoModalDialogProps.dialogHeader || "",
      newDialogBody: drawIoModalDialogProps.dialogBody,
    };
  },
  autoMaxHeight: true,
  autoMaxWidth: true,
};
