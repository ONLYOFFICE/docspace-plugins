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
  IBox,
  IText,
  IInput,
  Components,
  IMessage,
  Actions,
  InputGroup,
  TextGroup,
  BoxGroup,
} from "@onlyoffice/docspace-plugin-sdk";
import { acceptButtonProps } from "./button";
import { urlInputProps } from "./Url";

const onChange = (value: string) => {
  nameInputProps.value = value;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: { ...nameInputProps, value },
    contextProps: [
      {
        name: "accept-button",
        props: {
          ...acceptButtonProps,
          isDisabled: !value || !urlInputProps.value,
        },
      },
    ],
  };

  return message;
};

export const nameInputProps: IInput = {
  value: "",
  onChange,
  scale: true,
  placeholder: "New diagram",
};

const inputComponent: InputGroup = {
  component: Components.input,
  props: nameInputProps,
};

const inputBox: IBox = {
  marginProp: "0 0 16px",
  children: [inputComponent],
};

const inputTextProps: IText = {
  text: "Name",
  isBold: true,
};

const inputTextComponent: TextGroup = {
  component: Components.text,
  props: inputTextProps,
};

const inputTextBox: IBox = {
  marginProp: "0 0 4px",
  children: [inputTextComponent],
};

export const nameGroup: BoxGroup = {
  component: Components.box,
  props: {
    children: [
      { component: Components.box, props: inputTextBox },
      { component: Components.box, props: inputBox },
    ],
  },
};
