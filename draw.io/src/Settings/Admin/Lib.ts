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
  IToggleButton,
  IBox,
  Components,
  IMessage,
  Actions,
  ToggleButtonGroup,
  BoxGroup,
  IText,
  TextGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";

import { urlInput } from "./Url";
import { offToggleButtonProps } from "./Off";
import { langComboBox } from "./Lang";
import { adminButtonProps } from "./Button";

const onChange = () => {
  libToggleButtonProps.isChecked = !libToggleButtonProps.isChecked;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: libToggleButtonProps,
    contextProps: [
      {
        name: "acceptButton",
        props: {
          ...adminButtonProps,
          isDisabled: !drawIo.validateAdminSettings(
            urlInput.value || "",
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

export const libToggleButtonProps: IToggleButton = {
  isChecked: drawIo.adminSettings.lib,
  onChange,
  style: { position: "relative", gap: "0px" },
};

const toggleComponent: ToggleButtonGroup = {
  component: Components.toggleButton,
  props: libToggleButtonProps,
};

const toggleBox: IBox = {
  displayProp: "flex",
  alignItems: "center",
  children: [toggleComponent],
};

const libText: IText = {
  text: "Libraries",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "22px",
  noSelect: true,
};

const libTextComponent: TextGroup = {
  component: Components.text,
  props: libText,
};

const libTextBox: IBox = {
  marginProp: "0 0 0",
  children: [libTextComponent],
};

export const libGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    children: [
      { component: Components.box, props: libTextBox },
      { component: Components.box, props: toggleBox },
    ],
  },
};
