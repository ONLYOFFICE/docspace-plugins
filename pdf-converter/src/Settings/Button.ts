import {
  Actions,
  BoxGroup,
  ButtonGroup,
  ButtonSize,
  Components,
  IButton,
  IMessage,
  PluginStatus,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

import convertFile from "../ConvertFile";
import { tokenInput } from "./Token";
import plugin from "..";

const onClick = async () => {
  convertFile.setAPIToken(tokenInput.value);
  convertFile.saveAPIToken(tokenInput.value);

  plugin.updateStatus(PluginStatus.active);

  const message: IMessage = {
    actions: [Actions.showToast, Actions.updateProps, Actions.updateStatus],
    toastProps: [{ title: "Token is saved", type: ToastType.success }],
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
  isDisabled: false,
  withLoadingAfterClick: true,
};

export const userButtonComponent: ButtonGroup = {
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
