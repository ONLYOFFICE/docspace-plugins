import {
  IToggleButton,
  IBox,
  IText,
  Components,
  IMessage,
  Actions,
  ToggleButtonGroup,
  TextGroup,
  BoxGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";

import { urlInput } from "./Url";
import { langComboBox } from "./Lang";
import { libToggleButtonProps } from "./Lib";
import { adminButtonProps } from "./Button";

const onChange = () => {
  offToggleButtonProps.isChecked = !offToggleButtonProps.isChecked;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: offToggleButtonProps,
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

export const offToggleButtonProps: IToggleButton = {
  isChecked: drawIo.adminSettings.off,
  onChange,
  label: "Offline mode",
};

const toggleComponent: ToggleButtonGroup = {
  component: Components.toggleButton,
  props: offToggleButtonProps,
};

const toggleBox: IBox = {
  marginProp: "0 0 16px",
  children: [toggleComponent],
};

const textProps: IText = {
  text: `When the "offline mode" is active, this disabled all remote operations and features to protect`,
};

const textComponent: TextGroup = {
  component: Components.text,
  props: textProps,
};

const textBox: IBox = {
  marginProp: "0 0 8px",
  children: [textComponent],
};

export const offGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "column",
    children: [
      { component: Components.box, props: toggleBox },
      { component: Components.box, props: textBox },
    ],
  },
};
