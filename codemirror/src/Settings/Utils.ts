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
  IBox,
  Components,
  IToggleButton,
  IMessage,
  Actions,
  Component,
  IComboBox,
} from "@onlyoffice/docspace-plugin-sdk";
import { settingsButtonProps } from "./Button";

export function updatePropsWithButton(props: IToggleButton | IComboBox) {
  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: props,
    contextProps: [
      {
        name: "acceptButton",
        props: {
          ...settingsButtonProps,
          isDisabled: false,
        },
      },
    ],
  };

  return message;
}

export function createSettingsHeader(title: string): Component {
  const header: IBox = {
    marginProp: "6px 0 12px 0",
    children: [
      {
        component: Components.text,
        props: {
          text: title,
          isBold: true,
          fontSize: "18px",
          lineHeight: "22px",
          noSelect: true,
        },
      },
    ],
  };

  return { component: Components.box, props: header };
}

export function createToggleSetting(title: string, description: string, toggle: IToggleButton) {
  const setting: IBox = {
    displayProp: "flex",
    flexDirection: "column",
    marginProp: "0 12px 12px",
    children: [
      {
        component: Components.box,
        props: {
          displayProp: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          children: [
            {
              component: Components.text,
              props: {
                text: title,
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "22px",
                noSelect: true,
              },
            },
            {
              component: Components.toggleButton,
              props: toggle,
            },
          ],
        },
      },
      {
        component: Components.text,
        props: {
          text: description,
          color: "#A3A9AE",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: "16px",
          noSelect: true,
        },
      },
    ],
  };
  return setting;
}
