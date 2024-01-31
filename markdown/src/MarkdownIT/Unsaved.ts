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
    Actions, 
    ButtonSize, 
    Components, 
    IBox, 
    IButton, 
    ICheckbox, 
    IMessage, 
    IModalDialog, 
    IText, 
    ModalDisplayType 
} from "@onlyoffice/docspace-plugin-sdk";
import { intendBox } from "./Dialog";

const unsavedText: IText = {
    text: "Are you sure that you want to close this file without saving?"
}

const disableWarningCheckbox: ICheckbox = {
    label: "Do not show this message again",
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
    label: "Save and close",
    size: ButtonSize.normal,
    primary: true,
    withLoadingAfterClick: true,
    disableWhileRequestRunning: true,
    scale: true,
    onClick: () => {}
}

export const closeButton: IButton = {
    label: "Close without saving",
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
    dialogHeader: "File has some unsaved changes",
    dialogBody: unsavedBody,
    dialogFooter: unsavedFooter,
    onLoad: async () => {
        return {
            newDialogHeader: unsavedModalDialog.dialogHeader,
            newDialogBody: unsavedModalDialog.dialogBody,
            newDialogFooter: unsavedModalDialog.dialogFooter
        };
    },
    onClose: () => {}
}