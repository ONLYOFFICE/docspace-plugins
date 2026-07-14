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

import { IToggleButton } from "@onlyoffice/docspace-plugin-sdk";
import codemirror from "../Codemirror";
import { createToggleSetting, updatePropsWithButton } from "./Utils";
import { i18n } from "../locales";

export const highlightWhitespaceToggle: IToggleButton = {
  isChecked: codemirror.settings.highlightWhitespace,
  style: { position: "relative", gap: "0px" },
  onChange: () => {
    highlightWhitespaceToggle.isChecked = !highlightWhitespaceToggle.isChecked;
    return updatePropsWithButton(highlightWhitespaceToggle);
  },
};

export const highlightWhitespaceSetting = () => createToggleSetting(
  i18n.t("settings.highlight_whitespace"),
  i18n.t("settings.highlight_whitespace_description"),
  highlightWhitespaceToggle
);

export const highlightTrailingWhitespaceToggle: IToggleButton = {
  isChecked: codemirror.settings.highlightTrailingWhitespace,
  style: { position: "relative", gap: "0px" },
  onChange: () => {
    highlightTrailingWhitespaceToggle.isChecked = !highlightTrailingWhitespaceToggle.isChecked;
    return updatePropsWithButton(highlightTrailingWhitespaceToggle);
  },
};

export const highlightTrailingWhitespaceSetting = () => createToggleSetting(
  i18n.t("settings.highlight_trailing_whitespace"),
  i18n.t("settings.highlight_trailing_whitespace_description"),
  highlightTrailingWhitespaceToggle
);

export const autoCloseTagsToggle: IToggleButton = {
  isChecked: codemirror.settings.autoCloseTags,
  style: { position: "relative", gap: "0px" },
  onChange: () => {
    autoCloseTagsToggle.isChecked = !autoCloseTagsToggle.isChecked;
    return updatePropsWithButton(autoCloseTagsToggle);
  },
};

export const autoCloseTagsSetting = () => createToggleSetting(
  i18n.t("settings.auto_close_tags"),
  i18n.t("settings.auto_close_tags_description"),
  autoCloseTagsToggle
);
