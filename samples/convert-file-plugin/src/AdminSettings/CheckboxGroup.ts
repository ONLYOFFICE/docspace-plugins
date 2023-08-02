import {
  Actions,
  Components,
  IBox,
  ICheckbox,
  IMessage,
  IText,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

const onTxtChange = () => {
  txtProps.isChecked = !txtProps.isChecked;

  const txtToastTitle = txtProps.isChecked
    ? "Plugin will convert to .txt format"
    : "Plugin will not convert to .txt format";

  const message: IMessage = {
    newProps: txtProps,
    actions: [Actions.updateProps, Actions.showToast],
    toastProps: [
      {
        type: txtProps.isChecked ? ToastType.success : ToastType.info,
        title: txtToastTitle,
      },
    ],
  };

  return message;
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
    newProps: pdfProps,
    actions: [Actions.updateProps, Actions.showToast],
    toastProps: [
      {
        type: pdfProps.isChecked ? ToastType.success : ToastType.info,
        title: xlsxToastTitle,
      },
    ],
  };
};

export const pdfProps: ICheckbox = {
  label: "PDF",
  title: "PDF",
  isChecked: true,
  onChange: onPdfChange,
};

const txtBox: IBox = {
  marginProp: "0 0 16px",
  children: [{ component: Components.checkbox, props: txtProps }],
};

const pdfBox: IBox = {
  marginProp: "0 0 16px",
  children: [{ component: Components.checkbox, props: pdfProps }],
};

const textProps: IText = {
  text: "Select converted file formats:",
};

const textBox: IBox = {
  marginProp: "0 0 16px",
  children: [{ component: Components.text, props: textProps }],
};

export const checkboxGroupBox: IBox = {
  marginProp: "0 0 16px",
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: textBox },
    { component: Components.box, props: txtBox },
    { component: Components.box, props: pdfBox },
  ],
};

const textBoxSkeleton: IBox = {
  marginProp: "0 0 14px",
  children: [
    {
      component: Components.skeleton,
      props: {
        width: "80px",
        height: "16px",
        borderRadius: "6px",
      },
    },
  ],
};

const txtBoxSkeleton: IBox = {
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

const pdfBoxSkeleton: IBox = {
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
    { component: Components.box, props: textBoxSkeleton },
    { component: Components.box, props: txtBoxSkeleton },
    { component: Components.box, props: pdfBoxSkeleton },
  ],
};
