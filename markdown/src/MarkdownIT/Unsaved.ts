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

const closeButton: IButton = {
    label: "Close without saving",
    size: ButtonSize.normal,
    withLoadingAfterClick: true,
    disableWhileRequestRunning: true,
    scale: true,
    onClick: () => {
        const message: IMessage = {
            actions: [Actions.closeModal],
        };
        return message;
    }
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
    onClose: () => {
        const message: IMessage = {
            actions: [Actions.closeModal],
        };
        return message;
    }
}