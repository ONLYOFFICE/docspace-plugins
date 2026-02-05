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
  IModalDialog,
  IButton,
  IInput,
  IBox,
  ButtonSize,
  ModalDisplayType,
  Components,
  IMessage,
  IText,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import urlPlugin from "./Url";

let primaryLock = false;

function getValidURL(input: string) {
  let output = input.trim();

  try {
    const url = new URL(output);
    return url.href;
  } catch {
    output = "https://" + output;

    try {
      const url = new URL(output);
      return url.href;
    } catch {
      return null;
    }
  }
}

function generateLinkTitle(input: string) {
  try {
    const urlStr = input.trim().includes("://") ? input.trim() : "https://" + input.trim();
    const url = new URL(urlStr);
    const hostname = url.hostname.replace(/^www\./i, "");
    return "Link to " + hostname;
  } catch {
    return "New link";
  }
}

const marginBox: IBox = {
  heightProp: "10px",
  paddingProp: "0 5px",
};

export const urlDialog: (edit?: boolean, url?: string, title?: string) => IModalDialog = (edit = false, url, title) => {
  const primaryButton: IButton = {
    label: edit ? "Save" : "Create",
    size: ButtonSize.small,
    scale: true,
    primary: true,
    isDisabled: true,
    withLoadingAfterClick: true,
    onClick: async () => {
      if (primaryLock) return {} as IMessage;
      primaryLock = true;

      const validUrl = getValidURL(urlInput.value);
      console.log("validUrl", validUrl, "from", urlInput.value);
      if (!validUrl) {
        const errorMsg = urlInput.value ? "Invalid URL address" : "URL is required";

        urlInput.hasError = true;
        errorText.display = "block";
        errorText.text = errorMsg;

        primaryLock = false;
        return {
          actions: [Actions.updateContext],
          contextProps: [
            {
              name: "context-url-error-text",
              props: errorText,
            },
            {
              name: "context-url-input-url",
              props: urlInput,
            },
          ],
        } as IMessage;
      }

      const message: IMessage = {
        actions: [Actions.closeModal, Actions.showToast],
        toastProps: [],
      };

      if (edit) {
        const newTitle = titleInput.value ? titleInput.value : titleInput.placeholder!;
        const saved = await urlPlugin.saveFile(validUrl, newTitle == title ? undefined : newTitle);

        if (saved) {
          message.toastProps?.push({
            type: ToastType.success,
            title: "File saved successfully",
          });
        } else {
          message.toastProps?.push({
            type: ToastType.error,
            title: "Failed to save file",
          });
        }
      } else {
        const fileId = await urlPlugin.createNewFile(
          titleInput.value ? titleInput.value : titleInput.placeholder!,
          validUrl
        );

        if (fileId) {
          message.toastProps?.push({
            type: ToastType.success,
            title: "URL created successfully",
          });
        } else {
          message.toastProps?.push({
            type: ToastType.error,
            title: "Failed to create URL",
          });
        }
      }

      primaryLock = false;
      return message;
    },
  };

  const cancelButton: IButton = {
    label: "Cancel",
    size: ButtonSize.small,
    scale: true,
    onClick: () => {
      return {
        actions: [Actions.closeModal],
      };
    },
  };

  const urlInput: IInput = {
    name: "url-title",
    value: url || "",
    scale: true,
    isAutoFocused: true,
    onChange: (value: string) => {
      urlInput.value = value;
      titleInput.placeholder = value ? generateLinkTitle(value) : "";

      primaryButton.isDisabled = !urlInput.value || (edit && urlInput.value === url && titleInput.value === title);

      return {
        actions: [Actions.updateProps, Actions.updateContext],
        newProps: urlInput,
        contextProps: [
          {
            name: "context-url-input-title",
            props: titleInput,
          },
          {
            name: "context-url-primary-button",
            props: primaryButton,
          },
        ],
      } as IMessage;
    },
  };

  const titleInput: IInput = {
    name: "url-title",
    value: title || "",
    scale: true,
    placeholder: "",
    onChange: (value: string) => {
      titleInput.value = value;

      primaryButton.isDisabled = !urlInput.value || (edit && urlInput.value === url && titleInput.value === title);

      if (value === "") {
        titleInput.placeholder = urlInput.value ? generateLinkTitle(urlInput.value) : "";
      }

      return {
        actions: [Actions.updateProps, Actions.updateContext],
        newProps: titleInput,
        contextProps: [
          {
            name: "context-url-primary-button",
            props: primaryButton,
          },
        ],
      } as IMessage;
    },
  };

  const errorText: IText = {
    text: "",
    display: "none",
    color: "var(--error-color, var(--input-error-color))",
  };

  const dialog: IModalDialog = {
    dialogHeader: "Create new URL",
    displayType: ModalDisplayType.modal,
    dialogBody: {
      children: [
        {
          component: Components.text,
          props: {
            text: "URL:",
            isBold: true,
          },
        },
        {
          component: Components.box,
          props: marginBox,
        },
        {
          component: Components.input,
          props: urlInput,
          contextName: "context-url-input-url",
        },
        {
          component: Components.text,
          props: errorText,
          contextName: "context-url-error-text",
        },
        {
          component: Components.box,
          props: marginBox,
        },
        {
          component: Components.text,
          props: {
            text: "Title:",
            isBold: true,
          },
        },
        {
          component: Components.box,
          props: marginBox,
        },
        {
          component: Components.input,
          props: titleInput,
          contextName: "context-url-input-title",
        },
        {
          component: Components.box,
          props: {
            widthProp: "100%",
            paddingProp: "20px 0 0px 0",
            displayProp: "flex",
            justifyContent: "space-between",
            children: [
              {
                component: Components.button,
                props: cancelButton,
              },
              {
                component: Components.box,
                props: marginBox,
              },
              {
                component: Components.button,
                props: primaryButton,
                contextName: "context-url-primary-button",
              },
            ],
          },
        },
      ],
    },
    onClose: () => {
      return {
        actions: [Actions.closeModal],
      };
    },
    onLoad: async () => {
      return {
        newDialogBody: dialog.dialogBody,
        newDialogHeader: dialog.dialogHeader,
      };
    },
  };

  return dialog;
};
