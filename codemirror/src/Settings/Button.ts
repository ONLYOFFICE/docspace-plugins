/*
 * (c) Copyright Ascensio System SIA 2026
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
  Actions,
  ButtonGroup,
  ButtonSize,
  Components,
  IButton,
  IMessage,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import codemirror from "../Codemirror";
import { autoCloseTagsToggle, highlightTrailingWhitespaceToggle, highlightWhitespaceToggle } from "./Core";

const onClick = () => {
  codemirror.setSettings(
    highlightWhitespaceToggle?.isChecked,
    highlightTrailingWhitespaceToggle?.isChecked,
    autoCloseTagsToggle?.isChecked
  );

  const message: IMessage = {
    actions: [Actions.showToast, Actions.updateProps, Actions.saveSettings],
    toastProps: [{ title: "Data is saved", type: ToastType.success }],
    newProps: { ...settingsButtonProps, isDisabled: true },
    settings: codemirror.getSettings(),
  };

  return message;
};

export const settingsButtonProps: IButton = {
  onClick,
  size: ButtonSize.normal,
  label: "Save",
  scale: false,
  primary: true,
  isDisabled: true,
};

export const settingsButtonComponent: ButtonGroup = {
  component: Components.button,
  props: settingsButtonProps,
  contextName: "acceptButton",
};
