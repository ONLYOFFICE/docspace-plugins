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
  ButtonSize,
  Components,
  IBox,
  IButton,
  IFrame,
  IMessage,
  IModalDialog,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";

export const frameProps: IFrame = {
  width: "100%",
  height: "100%",
  name: "archives-iframe",
  id: "archives-iframe",
  src: "",
};

const iframeBox: IBox = {
  widthProp: "800px",
  heightProp: "60vh",
  children: [
    {
      component: Components.iFrame,
      props: frameProps,
    },
  ],
};

export const extractButton: IButton = {
  label: "Extract the archive",
  size: ButtonSize.small,
  primary: true,
  withLoadingAfterClick: true,
  disableWhileRequestRunning: true,
  onClick: () => {},
};

const intendBox: IBox = {
  widthProp: "8px",
};

const cancelButton: IButton = {
  label: "Cancel",
  size: ButtonSize.small,
  onClick: () => {
    return {
      actions: [Actions.closeModal],
    };
  },
};

const footerBox: IBox = {
  displayProp: "flex",
  flexDirection: "row",
  children: [
    {
      component: Components.button,
      props: extractButton,
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

export const modalDialogProps: IModalDialog = {
  dialogHeader: "Archive viewer",
  dialogBody: iframeBox,
  dialogFooter: footerBox,
  displayType: ModalDisplayType.modal,
  fullScreen: false,
  onClose: () => {
    const message: IMessage = {
      actions: [Actions.closeModal],
    };

    return message;
  },
  onLoad: async () => {
    return {
      newDialogHeader: modalDialogProps.dialogHeader || "",
      newDialogBody: modalDialogProps.dialogBody,
      newDialogFooter: modalDialogProps.dialogFooter,
    };
  },
  withoutBodyPadding: true,
  withoutHeaderMargin: true,
  autoMaxHeight: true,
  autoMaxWidth: true,
};
