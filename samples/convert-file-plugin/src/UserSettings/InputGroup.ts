import {
  Actions,
  ControlGroupElement,
  IControlGroup,
  IInput,
} from "@onlyoffice/docspace-plugin-sdk";

import acceptButton, { getIsDisabled } from "./AcceptButton";
import { docxProps, xlsxProps } from "./CheckboxGroup";

const onFileNameChange = (value: string) => {
  fileNameProps.value = value;
  return {
    newProps: { ...fileNameProps, value },
    actions: [Actions.updateProps, Actions.updateAcceptButtonProps],
    acceptButtonProps: {
      ...acceptButton,
      isDisabled: getIsDisabled(
        value,
        docxProps.isChecked || false,
        xlsxProps?.isChecked || false
      ),
    },
  };
};

export const fileNameProps: IInput = {
  placeholder: "Enter new file name",
  scale: true,
  isDisabled: false,
  onChange: onFileNameChange,
  value: "",
};

export const fileNameGroup: IControlGroup = {
  header: "File name",
  element: ControlGroupElement.input,
  elementProps: fileNameProps,
};

const inputGroup = [fileNameGroup];

export default inputGroup;
