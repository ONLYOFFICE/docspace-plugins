import {
  Actions,
  IButton,
  ButtonSize,
  ToastType,
  FilesExst,
} from "onlyoffice-docspace-plugin";

import inputGroup from "./InputGroup";
import checkboxGroup from "./CheckboxGroup";
import toggleButtonGroup from "./ToggleButtonGroup";

import convertFile, { SettingsValue } from "../ConvertFile";

const onAcceptButtonClick = () => {
  const fileName =
    !Array.isArray(inputGroup[0].elementProps) &&
    inputGroup[0].elementProps.value;

  const formats: FilesExst[] = [];

  if (
    Array.isArray(checkboxGroup.elementProps) &&
    checkboxGroup.elementProps[0]?.isChecked
  ) {
    formats.push(FilesExst.docx);
  }
  if (
    Array.isArray(checkboxGroup.elementProps) &&
    checkboxGroup.elementProps[1]?.isChecked
  ) {
    formats.push(FilesExst.xlsx);
  }

  const localStorage =
    Array.isArray(toggleButtonGroup.elementProps) &&
    toggleButtonGroup.elementProps[0]?.isChecked;

  const mockApi =
    Array.isArray(toggleButtonGroup.elementProps) &&
    toggleButtonGroup.elementProps[1]?.isChecked;

  const settings: SettingsValue = {
    fileName: fileName || "",
    formats: formats,
    mockApi: mockApi || false,
    localStorage: localStorage || false,
  };

  convertFile.setSettingsValue({ ...settings });
  convertFile.acceptSettings({ ...settings });

  return {
    newProps: { ...acceptButton, isDisabled: true },
    actions: [Actions.showToast, Actions.updateStatus, Actions.updateProps],
    toastProps: {
      type: ToastType.success,
      title: "Data is saved. Now you can use plugin",
    },
  };
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
    (inputGroup &&
      !Array.isArray(inputGroup[0].elementProps) &&
      inputGroup[0].elementProps.value) ||
      "",
    (checkboxGroup &&
      Array.isArray(checkboxGroup.elementProps) &&
      checkboxGroup.elementProps[0]?.isChecked) ||
      false,
    (checkboxGroup &&
      Array.isArray(checkboxGroup.elementProps) &&
      checkboxGroup.elementProps[1]?.isChecked) ||
      false
  ),
  onClick: onAcceptButtonClick,
  size: ButtonSize.small,
};

export default acceptButton;
