import {
  Actions,
  IButton,
  ButtonSize,
  ToastType,
  FilesExst,
  IMessage,
  IToast,
} from "@onlyoffice/docspace-plugin-sdk";

import { fileNameProps } from "./InputGroup";
import { docxProps, xlsxProps } from "./CheckboxGroup";
import { localStorageProps, mockApiStorageProps } from "./ToggleButtonGroup";

import convertFile, { UserSettingsValue } from "../ConvertFile";

const onAcceptButtonClick = async () => {
  const fileName = fileNameProps.value;

  const formats: FilesExst[] = [];

  if (docxProps?.isChecked) {
    formats.push(FilesExst.docx);
  }
  if (xlsxProps?.isChecked) {
    formats.push(FilesExst.xlsx);
  }

  const localStorage = localStorageProps?.isChecked;

  const mockApi = mockApiStorageProps?.isChecked;

  const settings: UserSettingsValue = {
    fileName: fileName || "",
    formats: formats,
    mockApi: mockApi || false,
    localStorage: localStorage || false,
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
    newProps: { ...acceptButton, isDisabled: true },
    actions: [Actions.showToast, Actions.updateStatus, Actions.updateProps],
    toastProps,
  };

  return message;
};

export const getIsDisabled = (
  fileName: string,
  isDocx: boolean,
  isXlsx: boolean
) => {
  return !fileName || (!isDocx && !isXlsx);
};

const acceptButton: IButton = {
  label: "Save",
  primary: true,
  isDisabled: getIsDisabled(
    fileNameProps.value || "",
    docxProps?.isChecked || false,
    xlsxProps?.isChecked || false
  ),
  onClick: onAcceptButtonClick,
  size: ButtonSize.small,
};

export default acceptButton;
