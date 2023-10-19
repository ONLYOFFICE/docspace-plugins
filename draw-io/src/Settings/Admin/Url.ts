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
  IInput,
  Components,
  IBox,
  InputSize,
  InputType,
  IText,
  IMessage,
  Actions,
  InputGroup,
  TextGroup,
  BoxGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";

import { langComboBox } from "./Lang";
import { offToggleButtonProps } from "./Off";
import { libToggleButtonProps } from "./Lib";
import { adminButtonProps } from "./Button";

const onChange = (value: string) => {
  urlInput.value = value;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: urlInput,
    contextProps: [
      {
        name: "acceptButton",
        props: {
          ...adminButtonProps,
          isDisabled: !drawIo.validateAdminSettings(
            value,
            langComboBox.selectedOption,
            offToggleButtonProps.isChecked,
            libToggleButtonProps.isChecked
          ),
        },
      },
    ],
  };

  return message;
};

export const urlInput: IInput = {
  value: drawIo.adminSettings.url,
  onChange,
  scale: true,
  size: InputSize.base,
  type: InputType.text,
};

const urlInputComponent: InputGroup = {
  component: Components.input,
  props: urlInput,
};

const inputBox: IBox = {
  marginProp: "0 0 24px",
  widthProp: "100%",
  children: [urlInputComponent],
};

const urlText: IText = {
  text: "Draw.io",
  fontWeight: 600,
  fontSize: "13px",
  lineHeight: "20px",
  noSelect: true,
};

const urlTextComponent: TextGroup = {
  component: Components.text,
  props: urlText,
};

const urlTextBox: IBox = {
  marginProp: "0 0 4px",
  children: [urlTextComponent],
};

export const urlGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "column",
    children: [
      { component: Components.box, props: urlTextBox },
      { component: Components.box, props: inputBox },
    ],
  },
};
