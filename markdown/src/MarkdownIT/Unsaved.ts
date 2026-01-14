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
    ButtonSize,
    Components,
    IBox,
    IButton,
    ICheckbox,
    IModalDialog,
    IText,
    ModalDisplayType
} from "@onlyoffice/docspace-plugin-sdk";
import { intendBox } from "./Dialog";
import { i18n } from "../locales";

export const unsavedText: IText = {
    text: i18n.t("unsaved.text")
}

export const disableWarningCheckbox: ICheckbox = {
    label: i18n.t("unsaved.checkbox"),
    isChecked: false,
    onChange: () => {}
}

const unsavedBody: IBox = {
    widthProp: "90%",
    children: [
        {
            component: Components.text,
            props: unsavedText
        },
        {
            component: Components.box,
            props: intendBox
        },
        {
            component: Components.checkbox,
            props: disableWarningCheckbox
        }
    ]
}

export const saveUnsavedButton: IButton = {
    label: i18n.t("unsaved.button_save_and_close"),
    size: ButtonSize.normal,
    primary: true,
    withLoadingAfterClick: true,
    disableWhileRequestRunning: true,
    scale: true,
    onClick: () => {}
}

export const closeButton: IButton = {
    label: i18n.t("unsaved.button_close_without_saving"),
    size: ButtonSize.normal,
    withLoadingAfterClick: true,
    disableWhileRequestRunning: true,
    scale: true,
    onClick: () => {}
}

const unsavedFooter: IBox = {
    displayProp: "flex",
    flexDirection: "row",
    children: [
        {
            component: Components.button,
            props: saveUnsavedButton
        },
        {
            component: Components.box,
            props: intendBox
        },
        {
            component: Components.button,
            props: closeButton
        }
    ]
}

export const unsavedModalDialog: IModalDialog = {
    displayType: ModalDisplayType.modal,
    dialogHeader: i18n.t("unsaved.header"),
    dialogBody: unsavedBody,
    dialogFooter: unsavedFooter,
    onLoad: async () => {
        return {
            newDialogHeader: i18n.t("unsaved.header"),
            newDialogBody: unsavedModalDialog.dialogBody,
            newDialogFooter: unsavedModalDialog.dialogFooter
        };
    },
    onClose: () => {}
}