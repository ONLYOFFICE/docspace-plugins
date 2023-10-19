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

import assemblyAI from "../AssemblyAI";

import { userButtonProps } from "./Button";

const onChange = (value: string) => {
  tokenInput.value = value;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: tokenInput,
    contextProps: [
      {
        name: "acceptButton",
        props: {
          ...userButtonProps,
        },
      },
    ],
  };

  return message;
};

export const tokenInput: IInput = {
  value: assemblyAI.apiToken,
  onChange,
  scale: true,
  size: InputSize.base,
  type: InputType.text,
};

const tokenInputComponent: InputGroup = {
  component: Components.input,
  props: tokenInput,
};

const inputBox: IBox = {
  widthProp: "100%",
  children: [tokenInputComponent],
};

const tokenText: IText = {
  text: "API token",
  fontWeight: 600,
  fontSize: "13px",
  lineHeight: "20px",
  noSelect: true,
};

const tokenTextComponent: TextGroup = {
  component: Components.text,
  props: tokenText,
};

const tokenTextBox: IBox = {
  marginProp: "0 0 4px",
  children: [tokenTextComponent],
};

export const tokenGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "column",
    marginProp: "0 0 8px",
    children: [
      { component: Components.box, props: tokenTextBox },
      { component: Components.box, props: inputBox },
    ],
  },
};
