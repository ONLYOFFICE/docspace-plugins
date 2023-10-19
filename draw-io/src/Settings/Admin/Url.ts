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
