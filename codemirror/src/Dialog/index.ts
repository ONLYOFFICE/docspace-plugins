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
  IBox,
  IModalDialog,
  ModalDisplayType,
  Components,
  Actions,
  IMessage,
  IText,
  IButton,
  ButtonSize,
  Component,
} from "@onlyoffice/docspace-plugin-sdk";

const closeDialog = () => {
  const message: IMessage = {
    actions: [Actions.closeModal],
  };

  return message;
};

export const saveButton: IButton = {
  label: "Save",
  size: ButtonSize.small,
  primary: true,
  withLoadingAfterClick: true,
  disableWhileRequestRunning: true,
  onClick: closeDialog,
};

const intendBox: IBox = {
  widthProp: "8px",
};

export const cancelButton: IButton = {
  label: "Cancel",
  size: ButtonSize.small,
  onClick: closeDialog,
};

export const footerBox: IBox = {
  widthProp: "100%",
  heightProp: "auto",
  displayProp: "flex",
  flexDirection: "row",
  children: [
    {
      component: Components.button,
      props: saveButton,
    },
    {
      component: Components.box,
      props: intendBox,
    },
    {
      component: Components.button,
      props: cancelButton,
    },
  ],
};

const iframeBox: IBox = {
  widthProp: "93vw",
  heightProp: "74vh",
  children: [
    {
      component: Components.iFrame,
      props: {
        width: "100%",
        height: "100%",
        name: "codemirror-plugin-iframe",
        id: "codemirror-plugin-iframe",
        src: "",
      },
    },
  ],
};

export const codemirrorModalDialogProps: IModalDialog = {
  dialogHeader: "",
  dialogBody: iframeBox,
  dialogFooter: footerBox,
  displayType: ModalDisplayType.modal,
  onClose: closeDialog,
  onLoad: async () => {
    return {
      newDialogHeader: codemirrorModalDialogProps.dialogHeader || "",
      newDialogBody: codemirrorModalDialogProps.dialogBody,
      newDialogFooter: codemirrorModalDialogProps.dialogFooter,
    };
  },
  withoutBodyPadding: true,
  withoutHeaderMargin: true,
  withFooterBorder: true,
  autoMaxHeight: true,
  autoMaxWidth: true,
};
