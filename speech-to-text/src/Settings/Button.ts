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

import assemblyAI from "../AssemblyAI";
import { tokenInput } from "./Token";
import plugin from "..";

const onClick = async () => {
  assemblyAI.setAPIToken(tokenInput.value);
  assemblyAI.saveAPIToken(tokenInput.value);

  if (assemblyAI.currentFileId) {
    await assemblyAI.speechToText(assemblyAI.currentFileId);
  }

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
