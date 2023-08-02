import {
  Actions,
  IButton,
  ButtonSize,
  ToastType,
  FilesExst,
  IMessage,
  IToast,
  ButtonGroup,
  Components,
  IBox,
  ISkeleton,
  SkeletonGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import { fileNameProps } from "./InputGroup";
import { docxProps, xlsxProps } from "./CheckboxGroup";

import convertFile, { UserSettingsValue } from "../ConvertFile";

const onAcceptButtonClick = async () => {
  const fileName = fileNameProps?.value;

  const formats: FilesExst[] = [];

  if (docxProps?.isChecked) {
    formats.push(FilesExst.docx);
  }
  if (xlsxProps?.isChecked) {
    formats.push(FilesExst.xlsx);
  }

  const settings: UserSettingsValue = {
    fileName: fileName || "",
    formats: formats,
  };

  convertFile.setUserSettingsValue({ ...settings });

  const convertMessage: IMessage | null = await convertFile.acceptUserSettings({
    ...settings,
  });

  const toastProps: IToast[] = [];

  if (convertMessage?.toastProps) {
    toastProps.push({
      type: ToastType.success,
      title: "Data is saved. Now you can use plugin",
    });
    toastProps.push(...convertMessage.toastProps);
  }

  const message: IMessage = {
    newProps: { ...acceptButtonProps, isDisabled: true },
    actions: [Actions.showToast, Actions.updateStatus, Actions.updateProps],
    toastProps,
  };

  return new Promise<IMessage>((resolve, reject) => {
    setTimeout(() => {
      resolve(message);
    }, 2000);
  });
};

export const getIsDisabled = (
  fileName: string,
  isDocx: boolean,
  isXlsx: boolean
) => {
  return !fileName || (!isDocx && !isXlsx);
};

export const acceptButtonProps: IButton = {
  label: "Save",
  primary: true,
  isDisabled: getIsDisabled(
    fileNameProps?.value || "",
    docxProps?.isChecked || false,
    xlsxProps?.isChecked || false
  ),
  onClick: onAcceptButtonClick,
  size: ButtonSize.normal,
  withLoadingAfterClick: true,
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
  width: "90px",
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
