import {
  Actions,
  ControlGroupElement,
  IControlGroup,
  IInput,
} from "onlyoffice-docspace-plugin";

import acceptButton, { getIsDisabled } from "./AcceptButton";
import checkboxGroup from "./CheckboxGroup";

const onFileNameChange = (value: string) => {
  fileNameProps.value = value;
  return {
    newProps: { ...fileNameProps, value },
    actions: [Actions.updateProps, Actions.updateAcceptButtonProps],
    acceptButtonProps: {
      ...acceptButton,
      isDisabled: getIsDisabled(
        value,
        (checkboxGroup &&
          Array.isArray(checkboxGroup.elementProps) &&
          checkboxGroup.elementProps[0]?.isChecked) ||
          false,
        (checkboxGroup &&
          Array.isArray(checkboxGroup.elementProps) &&
          checkboxGroup.elementProps[1]?.isChecked) ||
          false
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
