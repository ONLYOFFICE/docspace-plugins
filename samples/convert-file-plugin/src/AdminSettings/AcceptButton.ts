import {
  Actions,
  IButton,
  ButtonSize,
  ToastType,
  IMessage,
  IToast,
  ButtonGroup,
  Components,
  IBox,
  ISkeleton,
  SkeletonGroup,
} from "@onlyoffice/docspace-plugin-sdk";

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
    newProps: { ...acceptButtonProps, isDisabled: true },
    actions: [
      Actions.showToast,
      Actions.updateProps,
      Actions.updateStatus,
      Actions.closeSettingsModal,
    ],
    toastProps,
  };

  return new Promise<IMessage>((resolve, reject) => {
    setTimeout(() => {
      resolve(message);
    }, 2000);
  });
};

export const acceptButtonProps: IButton = {
  label: "Save",
  primary: true,
  isDisabled: false,
  scale: true,
  withLoadingAfterClick: true,
  onClick: onAcceptButtonClick,
  size: ButtonSize.normal,
};

const acceptButtonGroup: ButtonGroup = {
  component: Components.button,
  props: acceptButtonProps,
  contextName: "accept-button",
};

export const acceptButtonBox: IBox = {
  marginProp: "0 4px 0 0",
  widthProp: "50%",
  children: [acceptButtonGroup],
};

const acceptButtonPropsSkeleton: ISkeleton = {
  width: "100%",
  height: "40px",
  borderRadius: "6px",
};

const acceptButtonGroupSkeleton: SkeletonGroup = {
  component: Components.skeleton,
  props: acceptButtonPropsSkeleton,
};

export const acceptButtonBoxSkeleton: IBox = {
  marginProp: "0 4px 0 0",
  widthProp: "50%",
  children: [acceptButtonGroupSkeleton],
};
