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
  BoxGroup,
  ButtonGroup,
  ButtonSize,
  Components,
  IButton,
  IMessage,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";
import { themeComboBox } from "./Theme";
import { darkComboBox } from "./Dark";

const onClick = () => {
  drawIo.setUserSettings(
    themeComboBox.selectedOption.key,
    darkComboBox.selectedOption.key
  );

  const message: IMessage = {
    actions: [Actions.showToast, Actions.updateProps],
    toastProps: [{ title: "Data is saved", type: ToastType.success }],
    newProps: { ...userButtonProps, isDisabled: true },
  };

  return message;
};

export const userButtonProps: IButton = {
  onClick,
  size: ButtonSize.normal,
  label: "Save",
  scale: false,
  primary: true,
  isDisabled: !drawIo.validateUserSettings(
    themeComboBox.selectedOption.key,
    darkComboBox.selectedOption.key
  ),
};

const userButtonComponent: ButtonGroup = {
  component: Components.button,
  props: userButtonProps,
  contextName: "acceptButton",
};

export const userAcceptGroup: BoxGroup = {
  component: Components.box,
  props: {
    widthProp: "150px",
    children: [userButtonComponent],
  },
};
