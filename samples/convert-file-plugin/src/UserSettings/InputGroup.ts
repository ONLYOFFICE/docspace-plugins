import {
  Actions,
  Components,
  IBox,
  IInput,
  IMessage,
  ISkeleton,
  IText,
} from "@onlyoffice/docspace-plugin-sdk";

import { getIsDisabled, acceptButtonProps } from "./AcceptButton";
import { docxProps, xlsxProps } from "./CheckboxGroup";

const onFileNameChange = (value: string) => {
  fileNameProps.value = value;

  const message: IMessage = {
    newProps: { ...fileNameProps, value },
    actions: [Actions.updateProps, Actions.updateContext],
    contextProps: [
      {
        name: "accept-button",
        props: {
          ...acceptButtonProps,
          isDisabled: getIsDisabled(
            value,
            docxProps.isChecked || false,
            xlsxProps?.isChecked || false
          ),
        },
      },
    ],
  };

  return message;
};

export const fileNameProps: IInput = {
  placeholder: "Enter new file name",
  scale: true,
  isDisabled: false,
  onChange: onFileNameChange,
  value: "",
};

const fileNameInputBox: IBox = {
  marginProp: "0 0 16px",
  widthProp: "100%",
  children: [{ component: Components.input, props: fileNameProps }],
};

const textProps: IText = {
  text: "File name:",
};

const fileNameTextBox: IBox = {
  marginProp: "0 0 8px",
  widthProp: "100%",
  children: [{ component: Components.text, props: textProps }],
};

export const inputGroup: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: fileNameTextBox },
    { component: Components.box, props: fileNameInputBox },
  ],
};

const fileNamePropsSkeleton: ISkeleton = {
  width: "100%",
  height: "32px",
  borderRadius: "6px",
};

const fileNameInputBoxSkeleton: IBox = {
  marginProp: "0 0 14px",
  widthProp: "100%",
  children: [{ component: Components.skeleton, props: fileNamePropsSkeleton }],
};

const textPropsSkeleton: ISkeleton = {
  width: "100px",
  height: "16px",
  borderRadius: "6px",
};

const fileNameTextBoxSkeleton: IBox = {
  marginProp: "0 0 8px",
  widthProp: "100%",
  children: [{ component: Components.skeleton, props: textPropsSkeleton }],
};

export const inputGroupSkeleton: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: fileNameTextBoxSkeleton },
    { component: Components.box, props: fileNameInputBoxSkeleton },
  ],
};
