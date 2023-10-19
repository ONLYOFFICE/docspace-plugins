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
          isDisabled: !value,
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
  placeholder: "",
};

const inputComponent: InputGroup = {
  component: Components.input,
  props: nameInputProps,
};

const inputBox: IBox = {
  marginProp: "0 0 24px",
  children: [inputComponent],
};

const inputTextProps: IText = {
  text: "Name for converted file",
  isBold: true,
  fontWeight: 600,
  fontSize: "13px",
  lineHeight: "20px",
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
