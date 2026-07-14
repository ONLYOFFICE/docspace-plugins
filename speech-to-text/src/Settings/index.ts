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
  BoxGroup,
  Components,
  IBox,
  ISettings,
  TextGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import plugin from "..";
import assemblyAI from "../AssemblyAI";

import { tokenGroup, tokenInput } from "./Token";
import { userButtonComponent, userButtonProps } from "./Button";
import { tokenText } from "./Token";
import { i18n } from "../locales";

const descriptionText: TextGroup = {
  component: Components.text,
  props: {
    text: i18n.t("settings.text_description"),
    color: "#A3A9AE",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
  },
};

const descGroup: BoxGroup = {
  component: Components.box,
  props: { children: [descriptionText] },
};

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  // marginProp: "16px 0 0 0",
  children: [tokenGroup, descGroup],
};

const adminSettings: ISettings = {
  settings: parentBox,
  saveButton: userButtonComponent,
  onLoad: async () => {
    tokenInput.value = assemblyAI.getAPIToken();

    plugin.setAdminPluginSettings(adminSettings);

    tokenText.text = i18n.t("settings.text_api_token");
    userButtonProps.label = i18n.t("settings.button_save");

    return { settings: parentBox };
  },
};

export { adminSettings };
