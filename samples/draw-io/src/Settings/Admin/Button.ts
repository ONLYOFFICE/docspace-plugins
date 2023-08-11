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

import { urlInput } from "./Url";
import { langComboBox } from "./Lang";
import { offToggleButtonProps } from "./Off";
import { libToggleButtonProps } from "./Lib";

const onClick = () => {
  drawIo.setAdminSettings(
    urlInput?.value || "",
    langComboBox?.selectedOption,
    offToggleButtonProps?.isChecked,
    libToggleButtonProps?.isChecked
  );

  const message: IMessage = {
    actions: [Actions.showToast, Actions.updateProps],
    toastProps: [{ title: "Data is saved", type: ToastType.success }],
    newProps: { ...adminButtonProps, isDisabled: true },
  };

  return message;
};

export const adminButtonProps: IButton = {
  onClick,
  size: ButtonSize.normal,
  label: "Save",
  scale: false,
  primary: true,
  isDisabled: !drawIo.validateAdminSettings(
    urlInput?.value || "",
    langComboBox?.selectedOption,
    offToggleButtonProps?.isChecked,
    libToggleButtonProps?.isChecked
  ),
};

const adminButtonComponent: ButtonGroup = {
  component: Components.button,
  props: adminButtonProps,
  contextName: "acceptButton",
};

export const adminAcceptGroup: BoxGroup = {
  component: Components.box,
  props: {
    widthProp: "150px",
    children: [adminButtonComponent],
  },
};
