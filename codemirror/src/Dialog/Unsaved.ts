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
  IModalDialog,
  IText,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";

const unsavedText: IText = {
  text: "Continue without saving?\nYou have made changes in the configuration. If you proceed without saving, those changes will not be applied.",
};

const intendBox: IBox = {
  widthProp: "8px",
};

const unsavedBody: IBox = {
  widthProp: "100%",
  children: [
    {
      component: Components.text,
      props: unsavedText,
    },
  ],
};

const continueButton: IButton = {
  label: "Continue",
  size: ButtonSize.normal,
  primary: true,
  withLoadingAfterClick: true,
  disableWhileRequestRunning: true,
  scale: true,
  onClick: () => {
    return {
      actions: [Actions.closeModal],
    };
  },
};

export const reopenButton: IButton = {
  label: "Cancel",
  size: ButtonSize.normal,
  withLoadingAfterClick: true,
  disableWhileRequestRunning: true,
  scale: true,
  onClick: () => {},
};

const unsavedFooter: IBox = {
  displayProp: "flex",
  flexDirection: "row",
  widthProp: "100%",
  children: [
    {
      component: Components.button,
      props: continueButton,
    },
    {
      component: Components.box,
      props: intendBox,
    },
    {
      component: Components.button,
      props: reopenButton,
    },
  ],
};

export const unsavedModalDialog: IModalDialog = {
  displayType: ModalDisplayType.modal,
  dialogHeader: "Warning",
  dialogBody: unsavedBody,
  dialogFooter: unsavedFooter,
  onLoad: async () => {
    return {
      newDialogHeader: unsavedModalDialog.dialogHeader,
      newDialogBody: unsavedModalDialog.dialogBody,
      newDialogFooter: unsavedModalDialog.dialogFooter,
    };
  },
  onClose: () => {
    return {
      actions: [Actions.closeModal],
    };
  },
};
