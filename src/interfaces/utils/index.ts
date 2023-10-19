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

import { Actions } from "../../enums";
import {
  IBox,
  IButton,
  ICheckbox,
  IComboBox,
  ICreateDialog,
  IFrame,
  IImage,
  IInput,
  ILabel,
  IModalDialog,
  ISkeleton,
  IText,
  ITextArea,
  IToast,
  IToggleButton,
} from "../components";

export interface IPostMessage {
  frameId: string;
  message: { [key: string]: any };
}

export interface IMessage {
  actions?: Actions[];
  newProps?:
    | IInput
    | ICheckbox
    | IToggleButton
    | IButton
    | ITextArea
    | IComboBox;
  toastProps?: IToast[];
  contextProps?: {
    name: string;
    props:
      | IBox
      | IButton
      | ICheckbox
      | IComboBox
      | IFrame
      | IImage
      | IInput
      | ILabel
      | ISkeleton
      | IText
      | ITextArea
      | IToggleButton;
  }[];
  createDialogProps?: ICreateDialog;
  modalDialogProps?: IModalDialog;
  postMessage?: IPostMessage;
}
