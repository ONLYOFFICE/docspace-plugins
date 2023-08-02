import {
  Actions,
  Components,
  IBox,
  ICheckbox,
  IMessage,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

import { getIsDisabled, acceptButtonProps } from "./AcceptButton";

import { fileNameProps } from "./InputGroup";

const onDocxChange = () => {
  docxProps.isChecked = !docxProps.isChecked;

  const docxToastTitle = docxProps.isChecked
    ? "Plugin will show up for .docx files"
    : "Plugin will not show up for .docx files";

  const message: IMessage = {
    newProps: docxProps,
    actions: [Actions.updateProps, Actions.updateContext, Actions.showToast],
    toastProps: [
      {
        type: docxProps.isChecked ? ToastType.success : ToastType.info,
        title: docxToastTitle,
      },
    ],
    contextProps: [
      {
        name: "accept-button",
        props: {
          ...acceptButtonProps,
          isDisabled: getIsDisabled(
            fileNameProps.value || "",
            docxProps.isChecked,
            xlsxProps?.isChecked || false
          ),
        },
      },
    ],
  };

  return message;
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
    newProps: xlsxProps,
    actions: [Actions.updateProps, Actions.updateContext, Actions.showToast],
    toastProps: [
      {
        type: xlsxProps.isChecked ? ToastType.success : ToastType.info,
        title: xlsxToastTitle,
      },
    ],
    contextProps: [
      {
        name: "accept-button",
        props: {
          ...acceptButtonProps,
          isDisabled: getIsDisabled(
            fileNameProps.value || "",
            docxProps.isChecked,
            xlsxProps?.isChecked
          ),
        },
      },
    ],
  };
};

export const xlsxProps: ICheckbox = {
  label: "XLSX",
  title: "XLSX",
  isChecked: true,
  onChange: onXlsxChange,
};

const docxBox: IBox = {
  marginProp: "0 0 16px",
  children: [{ component: Components.checkbox, props: docxProps }],
};

const xlsxBox: IBox = {
  marginProp: "0 0 16px",
  children: [{ component: Components.checkbox, props: xlsxProps }],
};

export const checkboxGroupBox: IBox = {
  marginProp: "0 0 16px",
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: docxBox },
    { component: Components.box, props: xlsxBox },
  ],
};

const docxBoxSkeleton: IBox = {
  marginProp: "0 0 12px",
  children: [
    {
      component: Components.skeleton,
      props: {
        width: "100px",
        height: "18px",
        borderRadius: "6px",
      },
    },
  ],
};

const xlsxBoxSkeleton: IBox = {
  marginProp: "0 0 14px",
  children: [
    {
      component: Components.skeleton,
      props: {
        width: "100px",
        height: "18px",
        borderRadius: "6px",
      },
    },
  ],
};

export const checkboxGroupBoxSkeleton: IBox = {
  marginProp: "0 0 12px",
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: docxBoxSkeleton },
    { component: Components.box, props: xlsxBoxSkeleton },
  ],
};
