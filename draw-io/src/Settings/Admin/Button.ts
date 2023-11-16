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

import { urlInput } from "./Url";
import { langComboBox } from "./Lang";
import { offToggleButtonProps } from "./Off";
import { libToggleButtonProps } from "./Lib";

const onClick = () => {
  drawIo.setAdminSettings(
    urlInput?.value || "",
    langComboBox?.selectedOption,
    offToggleButtonProps?.isChecked,
    libToggleButtonProps?.isChecked
  );

  const message: IMessage = {
    actions: [Actions.showToast, Actions.updateProps, Actions.saveSettings],
    toastProps: [{ title: "Data is saved", type: ToastType.success }],
    newProps: { ...adminButtonProps, isDisabled: true },
    settings: drawIo.getAdminSettings(),
  };

  return message;
};

export const adminButtonProps: IButton = {
  onClick,
  size: ButtonSize.normal,
  label: "Save",
  scale: false,
  primary: true,
  isDisabled: true,
  // isDisabled: !drawIo.validateAdminSettings(
  //   urlInput?.value || "",
  //   langComboBox?.selectedOption,
  //   offToggleButtonProps?.isChecked,
  //   libToggleButtonProps?.isChecked
  // ),
};

export const adminButtonComponent: ButtonGroup = {
  component: Components.button,
  props: adminButtonProps,
  contextName: "acceptButton",
};

export const adminAcceptGroup: BoxGroup = {
  component: Components.box,
  props: {
    widthProp: "150px",
    children: [adminButtonComponent],
  },
};
