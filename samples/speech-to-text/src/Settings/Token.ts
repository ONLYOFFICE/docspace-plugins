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
  marginProp: "0 0 8px",
  widthProp: "300px",
  children: [tokenInputComponent],
};

const tokenText: IText = {
  text: "API token",
};

const tokenTextComponent: TextGroup = {
  component: Components.text,
  props: tokenText,
};

const tokenTextBox: IBox = {
  marginProp: "0 0 8px",
  children: [tokenTextComponent],
};

export const tokenGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "column",
    children: [
      { component: Components.box, props: tokenTextBox },
      { component: Components.box, props: inputBox },
    ],
  },
};
