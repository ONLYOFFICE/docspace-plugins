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
import { darkComboBox } from "./Dark";

export const themeOptions: IComboBoxItem[] = [
  { key: "default", label: "Default" },
  { key: "min", label: "Min" },
  { key: "atlas", label: "Atlas" },
  { key: "sketch", label: "Sketch" },
  { key: "simple", label: "Simple" },
];

const onSelect = (option: IComboBoxItem) => {
  themeComboBox.selectedOption = option;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: themeComboBox,
    contextProps: [
      {
        name: "acceptButton",
        props: {
          ...userButtonProps,
          isDisabled: !drawIo.validateUserSettings(
            option.key,
            darkComboBox.selectedOption.key
          ),
        },
      },
    ],
  };

  return message;
};

export const themeComboBox: IComboBox = {
  options: themeOptions,
  selectedOption: themeOptions.find(
    (o) => o.key === drawIo.userSettings.theme
  ) || { key: "default", label: "Default" },
  onSelect,
  scaled: true,
  directionY: "top",
};

const themeComponent: ComboBoxGroup = {
  component: Components.comboBox,
  props: themeComboBox,
};

const themeBox: IBox = {
  marginProp: "0 0 8px",
  widthProp: "200px",
  children: [themeComponent],
};

const themeText: IText = {
  text: "Theme:",
};

const themeTextComponent: TextGroup = {
  component: Components.text,
  props: themeText,
};

const themeTextBox: IBox = {
  marginProp: "0 0 8px",
  children: [themeTextComponent],
};

export const themeGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "column",
    children: [
      { component: Components.box, props: themeTextBox },
      { component: Components.box, props: themeBox },
    ],
  },
};
