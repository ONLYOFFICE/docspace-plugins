/*
 * (c) Copyright Ascensio System SIA 2025
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

import plugin from ".";
import { Actions, IMessage, IToast, ToastType, File } from "@onlyoffice/docspace-plugin-sdk";
import { imageEditorModalDialogProps, saveExitButton, dialogBody } from "./Dialog";

class ImageEditorPlugin {
  imageEditor: any;
  apiURL: string = "";
  currentFileId: number | null = null;
  saveRequestRunning: boolean = false;

  createAPIUrl = () => {
    const api = plugin.getAPI();

    this.apiURL = api.origin.replace(/\/+$/, "");

    const params = [api.proxy, api.prefix];

    if (this.apiURL) {
      params.forEach((part) => {
        if (!part) return;
        const newPart = part.trim().replace(/^\/+/, "");
        this.apiURL += newPart
          ? this.apiURL.length > 0 && this.apiURL[this.apiURL.length - 1] === "/"
            ? newPart
            : `/${newPart}`
          : "";
      });
    }
  };

  setAPIUrl = (url: string) => {
    this.apiURL = url;
  };

  getAPIUrl = () => {
    return this.apiURL;
  };

  saveFile = async (fileExst: string) => {
    const dataUrl = this.imageEditor.toDataURL({ format: fileExst });
    this.saveRequestRunning = true;

    const blob = await dataURLToBlob(dataUrl);

    const file = new File([blob], `blob`, {
      type: "",
      lastModified: new Date().getTime(),
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`${this.apiURL}/files/${this.currentFileId}/update`, {
        method: "PUT",
        body: formData,
      });
      this.saveRequestRunning = false;
      return true;
    } catch (e) {
      this.saveRequestRunning = false;
      console.log(e);
      return false;
    }
  };

  openFile = async (id: File | any) => {
    if (!this.apiURL) this.createAPIUrl();

    let file = id;

    if (!id.fileExst) {
      file = (await (await fetch(`${this.apiURL}/files/file/${id}`)).json()).response;
    }

    const userRes = (await (await fetch(`${this.apiURL}/people/@self`)).json()).response;
    var { theme } = userRes;
    if (theme === "System") theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Base";

    const { security, title } = file;

    if (!security?.Download) {
      return {
        actions: [Actions.showToast],
        toastProps: [
          {
            type: ToastType.error,
            title: "You don't have permission to view this file",
          } as IToast,
        ],
      };
    }

    fetch(`${this.apiURL}/files/file/${file.id}/recent`, {
      method: "POST",
      body: JSON.stringify({
        fileIds: [file.id],
      }),
    });

    this.currentFileId = file.id;

    imageEditorModalDialogProps.dialogHeader = title;
    saveExitButton.onClick = async () => {
      const message: IMessage = {
        actions: [Actions.showToast],
      };

      const success = await this.saveFile(file.fileExst);

      const toastProps: IToast = {
        type: success ? ToastType.success : ToastType.error,
        title: success ? "File saved successfully" : "File saving failed",
      };

      message.toastProps = [toastProps];
      if (success) {
        message.actions?.push(Actions.closeModal);
      }

      return message;
    };

    saveExitButton.scale = isMobile();
    dialogBody.widthProp = isMobile() ? "100vw" : "90vw";

    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: imageEditorModalDialogProps,
    };

    this.setupIframe(title, file.viewUrl, theme === "Dark");
    return message;
  };

  setupIframe = (title: string, url: string, dark: boolean) => {
    const iFrame = window.parent.document.getElementById("image-editor-plugin-iframe") as HTMLIFrameElement;
    if (!iFrame) {
      setTimeout(() => {
        this.setupIframe(title, url, dark);
      }, 50);
      return;
    }

    const styles = getStyles();
    iFrame.contentWindow!.document.head.innerHTML = styles;

    [
      "https://uicdn.toast.com/tui-image-editor/latest/tui-image-editor.css",
      "https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.css",
      "https://uicdn.toast.com/tui.time-picker/latest/tui-time-picker.css",
      "https://uicdn.toast.com/tui.date-picker/latest/tui-date-picker.css",
    ].forEach((url) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      iFrame.contentWindow!.document.head.appendChild(link);
    });

    [
      // TODO: all min and not latest
      "https://cdn.jsdelivr.net/npm/fabric@6.7.1/dist/index.min.js",
      "https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js",
      "https://uicdn.toast.com/tui.code-snippet/latest/tui-code-snippet.js",
      "https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.js",
      "https://uicdn.toast.com/tui-image-editor/latest/tui-image-editor.js",
    ].forEach((url) => {
      const script = document.createElement("script");
      script.src = url;
      iFrame.contentWindow!.document.body.appendChild(script);
    });

    const div = document.createElement("div");
    div.id = "tui-image-editor";
    iFrame.contentWindow!.document.body.appendChild(div);

    this.openImageEditor(iFrame, title, url, dark);
  };

  openImageEditor = (iframe: HTMLIFrameElement, title: string, url: string, dark: boolean) => {
    // @ts-ignore
    const tui = iframe.contentWindow!.tui;
    if (!tui || !tui.ImageEditor) {
      setTimeout(() => {
        this.openImageEditor(iframe, title, url, dark);
      }, 50);
      return;
    }

    const div = iframe.contentWindow!.document.getElementById("tui-image-editor");
    // @ts-ignore
    this.imageEditor = new tui.ImageEditor(div, {
      includeUI: {
        loadImage: {
          path: url,
          name: title.split(".").slice(0, -1).join("."),
        },
        theme: getTheme(dark),
        initMenu: "filter",
        uiSize: {
          width: "100%",
          height: "100%",
        },
        menuBarPosition: "right",
      },
      cssMaxWidth: iframe.contentWindow?.innerWidth,
      cssMaxHeight: iframe.contentWindow?.innerHeight,
      selectionStyle: {
        cornerSize: 20,
        rotatingPointOffset: 70,
      },
    });
  };
}

function dataURLToBlob(dataURL: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const parts = dataURL.split(";base64,");
    if (parts.length !== 2) {
      return reject(new Error("Invalid Data URL format"));
    }

    const mime = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);

    for (let i = 0; i < raw.length; i++) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    resolve(new Blob([uInt8Array], { type: mime }));
  });
}

function getStyles() {
  return `
    <style>
      body {
        margin: 0;
      }
    </style>
  `;
}

function getTheme(dark: boolean) {
  return {
    "common.bi.image": "",
    "common.bisize.width": "0px",
    "common.backgroundImage": "none",
    "common.backgroundColor": "#f3f4f6",
  };
}

function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
}

const imageEditorPlugin = new ImageEditorPlugin();

export default imageEditorPlugin;
