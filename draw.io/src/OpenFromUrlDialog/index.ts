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
  IModalDialog,
  IBox,
  IText,
  Components,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";
import { urlGroup } from "./Url";
import { nameGroup } from "./Name";
import { buttonGroup, onCancelClick } from "./button";
import { i18n } from "../locales/i18n";

export const descTextProps: IText = {
  text: i18n.t("open_from_url.description_text"),
};

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    urlGroup,
    nameGroup,
    { component: Components.text, props: descTextProps },
    { component: Components.box, props: buttonGroup },
  ],
};

export const openFromUrlProps: IModalDialog = {
  dialogHeader: i18n.t("open_from_url.dialog_header"),
  dialogBody: parentBox,
  displayType: ModalDisplayType.modal,
  autoMaxHeight: true,
  onClose: onCancelClick,
  onLoad: async () => {
    return {
      newDialogHeader: i18n.t("open_from_url.dialog_header"),
      newDialogBody: parentBox,
    };
  },
};
