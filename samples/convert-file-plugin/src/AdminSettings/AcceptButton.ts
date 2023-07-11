import {
  Actions,
  IButton,
  ButtonSize,
  ToastType,
  IMessage,
  IToast,
} from "onlyoffice-docspace-plugin";

import convertFile, { AdminSettingsValue } from "../ConvertFile";
import { pdfProps, txtProps } from "./CheckboxGroup";

const onAcceptButtonClick = async () => {
  const adminSettings: AdminSettingsValue = {
    pdf: pdfProps.isChecked || false,
    txt: txtProps.isChecked || false,
  };

  convertFile.setAdminSettingsValue(adminSettings);
  await convertFile.acceptAdminSettings(adminSettings);

  const toastProps: IToast[] = [];

  toastProps.push({
    type: ToastType.success,
    title: "Data is saved.",
  });

  const message: IMessage = {
    newProps: { ...acceptButton, isDisabled: true },
    actions: [Actions.showToast, Actions.updateProps],
    toastProps,
  };

  return message;
};

const acceptButton: IButton = {
  label: "Save",
  primary: true,
  isDisabled: false,
  onClick: onAcceptButtonClick,
  size: ButtonSize.small,
};

export default acceptButton;
