import {
  IToggleButton,
  IBox,
  Components,
  IMessage,
  Actions,
  ToggleButtonGroup,
  BoxGroup,
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
  label: "Libraries",
};

const toggleComponent: ToggleButtonGroup = {
  component: Components.toggleButton,
  props: libToggleButtonProps,
};

const toggleBox: IBox = {
  marginProp: "0 0 32px",
  children: [toggleComponent],
};

export const libGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "column",
    children: [{ component: Components.box, props: toggleBox }],
  },
};
