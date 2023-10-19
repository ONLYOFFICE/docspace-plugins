import {
  Actions,
  BoxGroup,
  ButtonGroup,
  ButtonSize,
  Components,
  IButton,
  IMessage,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";
import { themeComboBox } from "./Theme";
import { darkComboBox } from "./Dark";

const onClick = () => {
  drawIo.setUserSettings(
    themeComboBox.selectedOption.key,
    darkComboBox.selectedOption.key
  );

  const message: IMessage = {
    actions: [Actions.showToast, Actions.updateProps],
    toastProps: [{ title: "Data is saved", type: ToastType.success }],
    newProps: { ...userButtonProps, isDisabled: true },
  };

  return message;
};

export const userButtonProps: IButton = {
  onClick,
  size: ButtonSize.normal,
  label: "Save",
  scale: false,
  primary: true,
  isDisabled: !drawIo.validateUserSettings(
    themeComboBox.selectedOption.key,
    darkComboBox.selectedOption.key
  ),
};

const userButtonComponent: ButtonGroup = {
  component: Components.button,
  props: userButtonProps,
  contextName: "acceptButton",
};

export const userAcceptGroup: BoxGroup = {
  component: Components.box,
  props: {
    widthProp: "150px",
    children: [userButtonComponent],
  },
};
