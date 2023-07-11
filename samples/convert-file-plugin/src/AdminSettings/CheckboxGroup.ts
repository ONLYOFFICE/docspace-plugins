import {
  Actions,
  ControlGroupElement,
  ICheckbox,
  IControlGroup,
  ToastType,
} from "onlyoffice-docspace-plugin";
import acceptButton from "./AcceptButton";

const onTxtChange = () => {
  txtProps.isChecked = !txtProps.isChecked;

  const txtToastTitle = txtProps.isChecked
    ? "Plugin will convert to .txt format"
    : "Plugin will not convert to .txt format";

  return {
    newProps: checkboxProps,
    actions: [
      Actions.updateProps,
      Actions.updateAcceptButtonProps,
      Actions.showToast,
    ],
    toastProps: [
      {
        type: txtProps.isChecked ? ToastType.success : ToastType.info,
        title: txtToastTitle,
      },
    ],
    acceptButtonProps: {
      ...acceptButton,
      isDisabled: false,
    },
  };
};

export const txtProps: ICheckbox = {
  label: "TXT",
  title: "TXT",
  isChecked: true,
  onChange: onTxtChange,
};

const onPdfChange = () => {
  pdfProps.isChecked = !pdfProps.isChecked;

  const xlsxToastTitle = pdfProps.isChecked
    ? "Plugin will convert to .pdf format"
    : "Plugin will not convert to .pdf format";

  return {
    newProps: checkboxProps,
    actions: [
      Actions.updateProps,
      Actions.updateAcceptButtonProps,
      Actions.showToast,
    ],
    toastProps: [
      {
        type: pdfProps.isChecked ? ToastType.success : ToastType.info,
        title: xlsxToastTitle,
      },
    ],
    acceptButtonProps: {
      ...acceptButton,
      isDisabled: false,
    },
  };
};

export const pdfProps: ICheckbox = {
  label: "PDF",
  title: "PDF",
  isChecked: true,
  onChange: onPdfChange,
};

const checkboxProps: ICheckbox[] = [txtProps, pdfProps];

const checkboxGroup: IControlGroup = {
  header: "Select converted file formats:",
  element: ControlGroupElement.checkbox,
  elementProps: checkboxProps,
};

export default checkboxGroup;
