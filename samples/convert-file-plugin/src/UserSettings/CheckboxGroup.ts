import {
  Actions,
  ControlGroupElement,
  ICheckbox,
  IControlGroup,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import acceptButton, { getIsDisabled } from "./AcceptButton";
import { fileNameProps } from "./InputGroup";

const onDocxChange = () => {
  docxProps.isChecked = !docxProps.isChecked;

  const docxToastTitle = docxProps.isChecked
    ? "Plugin will show up for .docx files"
    : "Plugin will not show up for .docx files";

  return {
    newProps: checkboxProps,
    actions: [
      Actions.updateProps,
      Actions.updateAcceptButtonProps,
      Actions.showToast,
    ],
    toastProps: [
      {
        type: docxProps.isChecked ? ToastType.success : ToastType.info,
        title: docxToastTitle,
      },
    ],
    acceptButtonProps: {
      ...acceptButton,
      isDisabled: getIsDisabled(
        fileNameProps.value || "",
        docxProps.isChecked,
        xlsxProps?.isChecked || false
      ),
    },
  };
};

export const docxProps: ICheckbox = {
  label: "DOCX",
  title: "DOCX",
  isChecked: true,
  onChange: onDocxChange,
};

const onXlsxChange = () => {
  xlsxProps.isChecked = !xlsxProps.isChecked;

  const xlsxToastTitle = xlsxProps.isChecked
    ? "Plugin will show up for .xlsx files"
    : "Plugin will not show up for .xlsx files";

  return {
    newProps: checkboxProps,
    actions: [
      Actions.updateProps,
      Actions.updateAcceptButtonProps,
      Actions.showToast,
    ],
    toastProps: [
      {
        type: xlsxProps.isChecked ? ToastType.success : ToastType.info,
        title: xlsxToastTitle,
      },
    ],
    acceptButtonProps: {
      ...acceptButton,
      isDisabled: getIsDisabled(
        fileNameProps.value || "",
        docxProps?.isChecked || false,
        xlsxProps.isChecked
      ),
    },
  };
};

export const xlsxProps: ICheckbox = {
  label: "XLSX",
  title: "XLSX",
  isChecked: true,
  onChange: onXlsxChange,
};

const checkboxProps: ICheckbox[] = [docxProps, xlsxProps];

const checkboxGroup: IControlGroup = {
  header: "Select file formats:",
  element: ControlGroupElement.checkbox,
  elementProps: checkboxProps,
};

export default checkboxGroup;
