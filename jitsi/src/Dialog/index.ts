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
  Actions,
  IModalDialog,
  IMessage,
  IFrame,
  IBox,
  Components,
  ModalDisplayType,
  ButtonSize,
  IButton,
} from "@onlyoffice/docspace-plugin-sdk";

const closeDialog = () => {
  const message: IMessage = {
    actions: [Actions.closeModal],
  };

  return message;
};

// export const exitButton: IButton = { // TODO: remove or use
//   label: "Exit",
//   size: ButtonSize.small,
//   primary: true,
//   withLoadingAfterClick: true,
//   disableWhileRequestRunning: true,
//   onClick: closeDialog,
// };

const jitsiFrame: IFrame = {
  name: "jitsi-plugin-iframe",
  id: "jitsi-plugin-iframe",
  src: "",
  style: {
    height: "100%",
    width: "100%",
  },
};

const iframeBox: IBox = {
  widthProp: "100%",
  heightProp: "100%",
  children: [
    {
      component: Components.iFrame,
      props: jitsiFrame,
    },
  ],
};

export const dialogBody: IBox = {
  widthProp: "90vw",
  heightProp: "75vh",
  displayProp: "flex",
  flexDirection: "column",
  children: [
    {
      component: Components.box,
      props: iframeBox,
    },
  ],
};

// const dialogFooter: IBox = { // TODO: remove or use
//   widthProp: "100%",
//   heightProp: "100%",
//   children: [
//     {
//       component: Components.button,
//       props: exitButton,
//     },
//   ],
// };

export const jitsiModalDialogProps: IModalDialog = {
  dialogHeader: "",
  dialogBody: dialogBody,
  displayType: ModalDisplayType.modal,
  withoutBodyPadding: true,
  withoutHeaderMargin: true,
  onClose: () => {
    const message: IMessage = {
      actions: [Actions.closeModal],
    };

    return message;
  },
  onLoad: async () => {
    return {
      newDialogHeader: jitsiModalDialogProps.dialogHeader || "",
      newDialogBody: jitsiModalDialogProps.dialogBody,
      newDialogFooter: jitsiModalDialogProps.dialogFooter,
    };
  },
  autoMaxHeight: true,
  autoMaxWidth: true,
};
