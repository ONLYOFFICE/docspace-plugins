import {
  IBox,
  IText,
  IInput,
  Components,
  Actions,
  IMessage,
  InputGroup,
  TextGroup,
  BoxGroup,
} from "@onlyoffice/docspace-plugin-sdk";
import { acceptButtonProps } from "./button";
import { nameInputProps } from "./Name";

const onChange = (value: string) => {
  urlInputProps.value = value;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: { ...urlInputProps, value },
    contextProps: [
      {
        name: "accept-button",
        props: {
          ...acceptButtonProps,
          isDisabled: !value || !nameInputProps.value,
        },
      },
    ],
  };

  return message;
};

export const urlInputProps: IInput = {
  value: "",
  onChange,
  scale: true,
  placeholder: "Url for diagram",
};

const inputComponent: InputGroup = {
  component: Components.input,
  props: urlInputProps,
};

const inputBox: IBox = {
  marginProp: "0 0 16px",
  children: [inputComponent],
};

const inputTextProps: IText = {
  text: "URL",
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

export const urlGroup: BoxGroup = {
  component: Components.box,
  props: {
    children: [
      { component: Components.box, props: inputTextBox },
      { component: Components.box, props: inputBox },
    ],
  },
};
