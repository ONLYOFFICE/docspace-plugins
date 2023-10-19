/*
* (c) Copyright Ascensio System SIA 2023
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import {
  IButton,
  IBox,
  Components,
  ButtonSize,
  IMessage,
  Actions,
} from "@onlyoffice/docspace-plugin-sdk";
import convertFile from "../ConvertFile";
import { nameInputProps } from "./Name";

const onAcceptClick = async () => {
  const message = await convertFile.onConvertFileClick(nameInputProps.value);

  return message || {};
};

export const acceptButtonProps: IButton = {
  label: "Convert file",
  primary: true,
  size: ButtonSize.normal,
  scale: true,
  isDisabled: false,
  withLoadingAfterClick: true,
  onClick: onAcceptClick,
};

const acceptButtonBox: IBox = {
  paddingProp: "0 4px 0 0",
  widthProp: "50%",
  children: [
    {
      component: Components.button,
      props: acceptButtonProps,
      contextName: "accept-button",
    },
  ],
};

export const onCancelClick = () => {
  const message: IMessage = {
    actions: [Actions.closeModal],
  };

  return message;
};

export const cancelButtonProps: IButton = {
  label: "Cancel",
  size: ButtonSize.normal,
  scale: true,
  onClick: onCancelClick,
};

const cancelButtonBox: IBox = {
  paddingProp: "0 0 0 4px",
  widthProp: "50%",
  children: [{ component: Components.button, props: cancelButtonProps }],
};

export const buttonGroup: IBox = {
  widthProp: "100%",
  displayProp: "flex",
  flexDirection: "row",
  children: [
    { component: Components.box, props: acceptButtonBox },
    { component: Components.box, props: cancelButtonBox },
  ],
};
