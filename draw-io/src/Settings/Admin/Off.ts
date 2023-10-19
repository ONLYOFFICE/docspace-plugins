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
  style: { position: "relative", gap: "0px" },
};

const toggleComponent: ToggleButtonGroup = {
  component: Components.toggleButton,
  props: offToggleButtonProps,
};

const toggleBox: IBox = {
  displayProp: "flex",
  alignItems: "center",
  children: [toggleComponent],
};

const textProps: IText = {
  text: `When the "offline mode" is active, this disabled all remote operations and features to protect`,
  color: "#A3A9AE",
  fontSize: "12px",
  fontWeight: 400,
  lineHeight: "16px",
  noSelect: true,
};

const textComponent: TextGroup = {
  component: Components.text,
  props: textProps,
};

export const offDescriptionBox: IBox = {
  marginProp: "0 0 24px",
  children: [textComponent],
};

const offText: IText = {
  text: "Offline mode",
  fontWeight: 600,
  fontSize: "16px",
  lineHeight: "22px",
  noSelect: true,
};

const offTextComponent: TextGroup = {
  component: Components.text,
  props: offText,
};

const offTextBox: IBox = {
  marginProp: "0 0 0",
  children: [offTextComponent],
};

export const offGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginProp: "0 0 8px",
    children: [
      { component: Components.box, props: offTextBox },
      { component: Components.box, props: toggleBox },
    ],
  },
};
