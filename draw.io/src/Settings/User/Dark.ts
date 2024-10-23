/*
* (c) Copyright Ascensio System SIA 2024
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
  IComboBox,
  IComboBoxItem,
  IBox,
  Components,
  IText,
  Actions,
  IMessage,
  ComboBoxGroup,
  TextGroup,
  BoxGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";

import { userButtonProps } from "./Button";
import { themeComboBox } from "./Theme";

export const darkOptions: IComboBoxItem[] = [
  { key: "auto", label: "Auto" },
  { key: "0", label: "Disable" },
  { key: "1", label: "Enable" },
];

const onSelect = (option: IComboBoxItem) => {
  darkComboBox.selectedOption = option;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: darkComboBox,
    contextProps: [
      {
        name: "acceptButton",
        props: {
          ...userButtonProps,
          isDisabled: !drawIo.validateUserSettings(
            themeComboBox.selectedOption.key,
            option.key
          ),
        },
      },
    ],
  };

  return message;
};

export const darkComboBox: IComboBox = {
  options: darkOptions,
  selectedOption: darkOptions.find(
    (o) => o.key === drawIo.userSettings.dark
  ) || {
    key: "auto",
    label: "Auto",
  },
  onSelect,
  scaled: true,
  directionY: "top",
};

const darkComponent: ComboBoxGroup = {
  component: Components.comboBox,
  props: darkComboBox,
};

const darkBox: IBox = {
  marginProp: "0 0 8px",
  widthProp: "200px",
  children: [darkComponent],
};

const darkText: IText = {
  text: "Dark:",
};

const darkTextComponent: TextGroup = {
  component: Components.text,
  props: darkText,
};

const darkTextBox: IBox = {
  marginProp: "0 0 8px",
  children: [darkTextComponent],
};

export const darkGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "column",
    children: [
      { component: Components.box, props: darkTextBox },
      { component: Components.box, props: darkBox },
    ],
  },
};
