/*
* (c) Copyright Ascensio System SIA 2024
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
  IComboBox,
  IComboBoxItem,
  IBox,
  Components,
  IText,
  Actions,
  IMessage,
  ComboBoxGroup,
  BoxGroup,
  TextGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";

import { urlInput } from "./Url";
import { offToggleButtonProps } from "./Off";
import { libToggleButtonProps } from "./Lib";
import { adminButtonProps } from "./Button";

export const options: IComboBoxItem[] = [
  { key: "auto", label: "Auto" },
  { key: "id", label: "Bahasa Indonesia" },
  { key: "ms", label: "Bahasa Melayu" },
  { key: "bs", label: "Bosanski" },
  { key: "bg", label: "Bulgarian" },
  { key: "ca", label: "Català" },
  { key: "cs", label: "Čeština" },
  { key: "da", label: "Dansk" },
  { key: "de", label: "Deutsch" },
  { key: "et", label: "Eesti" },
  { key: "en", label: "English" },
  { key: "es", label: "Español" },
  { key: "eu", label: "Euskara" },
  { key: "fil", label: "Filipino" },
  { key: "fr", label: "Français" },
  { key: "gl", label: "Galego" },
  { key: "it", label: "Italiano" },
  { key: "hu", label: "Magyar" },
  { key: "lt", label: "Lietuvių" },
  { key: "lv", label: "Latviešu" },
  { key: "nl", label: "Nederlands" },
  { key: "no", label: "Norsk" },
  { key: "pl", label: "Polski" },
  { key: "pt-br", label: "Português (Brasil)" },
  { key: "pt", label: "Português (Portugal)" },
  { key: "ro", label: "Română" },
  { key: "fi", label: "Suomi" },
  { key: "sv", label: "Svenska" },
  { key: "vi", label: "Tiếng Việt" },
  { key: "tr", label: "Türkçe" },
  { key: "el", label: "Ελληνικά" },
  { key: "ru", label: "Русский" },
  { key: "sr", label: "Српски" },
  { key: "uk", label: "Українська" },
  { key: "he", label: "עברית" },
  { key: "ar", label: "العربية" },
  { key: "fa", label: "فارسی" },
  { key: "th", label: "ไทย" },
  { key: "ko", label: "한국어" },
  { key: "ja", label: "日本語" },
  { key: "zh", label: "简体中文" },
  { key: "zh-tw", label: "繁體中文" },
];

const onSelect = (option: IComboBoxItem) => {
  langComboBox.selectedOption = option;

  const message: IMessage = {
    actions: [Actions.updateProps, Actions.updateContext],
    newProps: langComboBox,
    contextProps: [
      {
        name: "acceptButton",
        props: {
          ...adminButtonProps,
          isDisabled: !drawIo.validateAdminSettings(
            urlInput.value || "",
            option,
            offToggleButtonProps.isChecked,
            libToggleButtonProps.isChecked
          ),
        },
      },
    ],
  };

  return message;
};

export const langComboBox: IComboBox = {
  options,
  selectedOption: options.find((o) => o.key === drawIo.adminSettings.lang) || {
    key: "auto",
    label: "Auto",
  },
  onSelect,
  scaled: true,
  dropDownMaxHeight: 400,
  directionY: "both",
  scaledOptions: true,
};

const langComponent: ComboBoxGroup = {
  component: Components.comboBox,
  props: langComboBox,
};

const langBox: IBox = {
  marginProp: "0 0 20px",
  widthProp: "100%",
  children: [langComponent],
};

const langText: IText = {
  text: "Language",
  fontWeight: 600,
  fontSize: "13px",
  lineHeight: "20px",
  noSelect: true,
};

const langTextComponent: TextGroup = {
  component: Components.text,
  props: langText,
};

const langTextBox: IBox = {
  marginProp: "0 0 0",
  children: [langTextComponent],
};

export const langGroup: BoxGroup = {
  component: Components.box,
  props: {
    displayProp: "flex",
    flexDirection: "column",
    children: [
      { component: Components.box, props: langTextBox },
      { component: Components.box, props: langBox },
    ],
  },
};
