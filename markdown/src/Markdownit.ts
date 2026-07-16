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

import plugin from ".";
import {
  markdownitModalDialogProps,
  saveButton,
  editorBody,
  mdArea,
  saveExitButton,
  fileSavedToast,
  markdownResize,
  editorBox,
  markdownSide,
  intendBox,
  previewSide,
  previewResize,
  viewerBody,
  editorFooter,
  iframeBox,
  borderProp,
} from "./MarkdownIT/Dialog";
import markdownit from "markdown-it";
import hljs from "highlight.js";
import properties from "./properties.json";
import {
  Actions,
  Components,
  IMessage,
  IToast,
  ToastType,
  File,
} from "@onlyoffice/docspace-plugin-sdk";
import {
  closeButton,
  saveUnsavedButton,
  unsavedModalDialog,
} from "./MarkdownIT/Unsaved";
import { i18n } from "./locales";

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return "";
  },
});

class Markdownit {
  apiURL: string = "";
  currentFileId: number | null = null;
  saveRequestRunning: boolean = false;
  currentFolderId: number | null = null;
  fulscreen: boolean = false;
  fileChanged: boolean = false;
  dark: boolean = false;
  mobile: boolean = false;

  setCurrentFolderId = (id: number | null) => {
    this.currentFolderId = id;
  };

  createAPIUrl = () => {
    const api = plugin.getAPI();

    this.apiURL = api.origin.replace(/\/+$/, "");

    const params = [api.proxy, api.prefix];

    if (this.apiURL) {
      params.forEach((part) => {
        if (!part) return;
        const newPart = part.trim().replace(/^\/+/, "");
        this.apiURL += newPart
          ? this.apiURL.length > 0 &&
            this.apiURL[this.apiURL.length - 1] === "/"
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

  createNewFile = async (value: string) => {
    if (!this.apiURL) this.createAPIUrl();

    const blob = new Blob([" "]);
    const file = new File([blob], `blob`, {
      type: "",
      lastModified: new Date().getTime(),
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const sessionRes = await fetch(
        `${this.apiURL}/files/${this.currentFolderId}/upload/create_session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            createOn: new Date(),
            fileName: `${value}.md`,
            fileSize: file.size,
            relativePath: "",
            CreateNewIfExist: true,
          }),
        }
      );

      const sessionData = (await sessionRes.json()).response.data;

      const data = await (
        await fetch(`${sessionData.location}`, {
          method: "POST",
          body: formData,
        })
      ).json();
      if (!data.success) return data;

      const { id: fileId } = data.data;

      return fileId;
    } catch (e) {
      console.log(e);
    }
  };

  editMarkdown = async (id: File | any, view: boolean) => {
    if (!this.apiURL) this.createAPIUrl();

    let file = id;

    if (!id.fileExst) {
      file = (await (await fetch(`${this.apiURL}/files/file/${id}`)).json())
        .response;
    }

    if (file.fileExst !== ".md") {
      return {
        actions: [Actions.showToast],
        toastProps: [
          { type: ToastType.error, title: i18n.t("toast_wrong_file_format") } as IToast,
        ],
      };
    }

    const userRes = (await (await fetch(`${this.apiURL}/people/@self`)).json())
      .response;

    var { isVisitor, theme } = userRes;

    if (theme === "System")
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "Dark"
        : "Base";

    if (theme === "Dark") {
      this.dark = true;
      iframeBox.backgroundProp = "rgb(41, 41, 41)";
      borderProp.color = "rgb(71, 71, 71)";
    } else {
      this.dark = false;
      iframeBox.backgroundProp = "rgb(255, 255, 255)";
      borderProp.color = "rgb(208, 213, 218)";
    }

    const { access, security, title } = file;

    if (!security?.Download) {
      return {
        actions: [Actions.showToast],
        toastProps: [
          {
            type: ToastType.error,
            title: i18n.t("toast_no_permissions"),
          } as IToast,
        ],
      };
    }

    const showSaveButton =
      security?.Edit ||
      access === 0 ||
      access === 1 ||
      access === 9 ||
      access === 10 ||
      access === 11;

    this.currentFileId = file.id;

    const data = await fetch(file.viewUrl);

    if (data.status !== 200) {
      return {
        actions: [Actions.showToast],
        toastProps: [
          { type: ToastType.error, title: i18n.t("toast_cant_read_file") } as IToast,
        ],
      };
    }

    fetch(`${this.apiURL}/files/file/${file.id}/recent`, {
      method: "POST",
      body: JSON.stringify({
        fileIds: [file.id],
      }),
    });

    const dataBlob = await data.blob();

    const dataText = await dataBlob.text();

    this.fulscreen = false;

    this.mobile = isMobile();

    if (!showSaveButton || view) {
      const message = this.openViewer(dataText, title);

      return message;
    } else {
      const message = this.openEditor(dataText, title);

      return message;
    }
  };

  openViewer = (data: string, title: string): IMessage => {
    markdownitModalDialogProps.dialogHeader = title;
    markdownitModalDialogProps.dialogBody = viewerBody;
    markdownitModalDialogProps.onLoad = async () => {
      insertMD(data);

      return {
        newDialogBody: markdownitModalDialogProps.dialogBody,
        newDialogHeader: title,
      };
    };
    if (this.mobile) {
      markdownitModalDialogProps.fullScreen = true;
      viewerBody.children = [
        {
          component: Components.box,
          props: iframeBox,
        },
        {
          component: Components.box,
          props: intendBox,
        },
        {
          component: Components.button,
          props: {
            label: i18n.t("button_close"),
            size: saveExitButton.size,
            scale: true,
            onClick: () => {
              return {
                actions: [Actions.closeModal],
              };
            },
          },
        },
      ];
    } else {
      markdownitModalDialogProps.fullScreen = false;
      viewerBody.children = [
        {
          component: Components.box,
          props: iframeBox,
        },
      ];
    }
    setSizes(false, this.mobile);
    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: markdownitModalDialogProps,
    };

    return message;
  };

  openEditor = (data: string, title: string): IMessage => {
    saveExitButton.onClick = async () => {
      let success = await this.saveMarkdown(mdArea.value);
      if (success) {
        saveExitButton.isDisabled = saveButton.isDisabled = true;
        this.stopEdit();
        var message: IMessage = {
          actions: [Actions.closeModal, Actions.showToast],
          toastProps: [fileSavedToast(true)],
        };
        this.fileChanged = false;
      } else {
        message = {
          actions: [Actions.showToast],
          toastProps: [fileSavedToast(false)],
        };
      }
      return message;
    };
    saveButton.onClick = async () => {
      let success = await this.saveMarkdown(mdArea.value);
      if (success) {
        saveExitButton.isDisabled = saveButton.isDisabled = true;
        var message: IMessage = {
          actions: [Actions.updateContext, Actions.showToast],
          toastProps: [fileSavedToast(true)],
          contextProps: [
            {
              name: "editorFooter",
              props: editorFooter,
            },
          ],
        };
        this.fileChanged = false;
      } else {
        message = {
          actions: [Actions.showToast],
          toastProps: [fileSavedToast(false)],
        };
      }

      return message;
    };
    mdArea.value = data;
    mdArea.onChange = (value: string) => {
      this.fileChanged = true;
      mdArea.value = value;
      if (saveButton.isDisabled) {
        saveExitButton.isDisabled = saveButton.isDisabled = false;
        var message: IMessage = {
          actions: [Actions.updateProps, Actions.updateContext],
          newProps: mdArea,
          contextProps: [
            {
              name: "editorFooter",
              props: editorFooter,
            },
          ],
        };
      } else {
        message = {
          actions: [Actions.updateProps],
          newProps: mdArea,
        };
      }

      updateMD(value);
      return message;
    };
    if (this.mobile) {
      markdownResize.label = i18n.t("button_preview");
      previewResize.label = i18n.t("button_write");
      markdownResize.onClick = () => {
        editorBox.children = [
          {
            component: Components.box,
            props: previewSide,
          },
        ];
        var message: IMessage = {
          actions: [Actions.updateContext],
          contextProps: [
            {
              name: "editorBox",
              props: editorBox,
            },
          ],
        };
        let currentData = mdArea.value;
        insertMD(currentData);
        return message;
      };
      previewResize.onClick = () => {
        editorBox.children = [
          {
            component: Components.box,
            props: markdownSide,
          },
        ];
        var message: IMessage = {
          actions: [Actions.updateContext],
          contextProps: [
            {
              name: "editorBox",
              props: editorBox,
            },
          ],
        };
        return message;
      };
    } else {
      markdownResize.label = i18n.t("dialog.button_markdown_resize");
      previewResize.label = i18n.t("dialog.button_preview_resize");
      markdownResize.onClick = () => {
        resizeTextArea();
        if (this.fulscreen) {
          markdownSide.widthProp = "50%";
          delete previewSide.displayProp;
          var message: IMessage = {
            actions: [Actions.updateContext],
            contextProps: [
              { name: "markdownSide", props: markdownSide },
              { name: "previewSide", props: previewSide },
              { name: "editorIntend", props: intendBox },
            ],
          };
          this.fulscreen = false;
          let currentData = mdArea.value;
          insertMD(currentData);
          return message;
        } else {
          markdownSide.widthProp = "100%";
          previewSide.displayProp = "none";
          var message: IMessage = {
            actions: [Actions.updateContext],
            contextProps: [
              { name: "markdownSide", props: markdownSide },
              { name: "previewSide", props: previewSide },
              {
                name: "editorIntend",
                props: { ...intendBox, displayProp: "none" },
              },
            ],
          };
          this.fulscreen = true;
          return message;
        }
      };
      previewResize.onClick = () => {
        if (this.fulscreen) {
          previewSide.widthProp = "50%";
          delete markdownSide.displayProp;
          var message: IMessage = {
            actions: [Actions.updateContext],
            contextProps: [
              { name: "markdownSide", props: markdownSide },
              { name: "previewSide", props: previewSide },
              { name: "editorIntend", props: intendBox },
            ],
          };
          this.fulscreen = false;
          let currentData = mdArea.value;
          insertMD(currentData);
          return message;
        } else {
          previewSide.widthProp = "100%";
          markdownSide.displayProp = "none";
          var message: IMessage = {
            actions: [Actions.updateContext],
            contextProps: [
              { name: "markdownSide", props: markdownSide },
              { name: "previewSide", props: previewSide },
              {
                name: "editorIntend",
                props: { ...intendBox, displayProp: "none" },
              },
            ],
          };
          this.fulscreen = true;
          let currentData = mdArea.value;
          insertMD(currentData);
          return message;
        }
      };
    }
    closeButton.onClick = unsavedModalDialog.onClose = () => {
      const message: IMessage = {
        actions: [Actions.closeModal],
      };
      this.fileChanged = false;
      return message;
    };
    saveUnsavedButton.onClick = async () => {
      let success = await this.saveMarkdown(mdArea.value);
      if (success) {
        this.stopEdit();
        var message: IMessage = {
          actions: [Actions.closeModal, Actions.showToast],
          toastProps: [fileSavedToast(true)],
        };
        this.fileChanged = false;
      } else {
        message = {
          actions: [Actions.showToast],
          toastProps: [fileSavedToast(false)],
        };
      }
      return message;
    };
    let onClose = () => {
      saveExitButton.isDisabled = saveButton.isDisabled = true;
      const message: IMessage = {
        actions: [Actions.closeModal],
      };
      if (this.fileChanged) {
        message.actions?.push(Actions.showModal);
        message.modalDialogProps = unsavedModalDialog;
      }
      return message;
    };
    if (this.mobile) {
      previewSide.widthProp = "100%";
      markdownSide.widthProp = "100%";
      markdownitModalDialogProps.fullScreen = true;
      editorBox.children = [
        {
          component: Components.box,
          props: markdownSide,
        },
      ];
      editorFooter.widthProp = "100%";
      editorFooter.children = [
        {
          component: Components.button,
          props: saveExitButton,
          contextName: "saveExitButton",
        },
        {
          component: Components.box,
          props: intendBox,
        },
        {
          component: Components.button,
          props: {
            label: "Exit",
            size: saveExitButton.size,
            scale: true,
            onClick: onClose,
          },
        },
      ];
    } else {
      previewSide.widthProp = "50%";
      markdownSide.widthProp = "50%";
      delete markdownSide.displayProp;
      delete previewSide.displayProp;
      markdownitModalDialogProps.fullScreen = false;
      editorFooter.widthProp = "30%";
      editorBox.children = [
        {
          component: Components.box,
          props: markdownSide,
          contextName: "markdownSide",
        },
        {
          component: Components.box,
          props: intendBox,
          contextName: "editorIntend",
        },
        {
          component: Components.box,
          props: previewSide,
          contextName: "previewSide",
        },
      ];
      editorFooter.children = [
        {
          component: Components.button,
          props: saveExitButton,
          contextName: "saveExitButton",
        },
      ];
    }

    markdownitModalDialogProps.dialogHeader = title;
    markdownitModalDialogProps.dialogBody = editorBody;
    markdownitModalDialogProps.onClose = onClose;
    markdownitModalDialogProps.onLoad = async () => {
      resizeTextArea();
      if (!this.mobile) insertMD(data);

      return {
        newDialogBody: markdownitModalDialogProps.dialogBody,
        newDialogHeader: title,
      };
    };
    setSizes(true, this.mobile);
    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: markdownitModalDialogProps,
    };
    if (this.mobile)
      window.addEventListener(
        "orientationchange",
        async function () {
          resizeTextArea();
          const iframe = window.parent.document.getElementById(
            "md-iframe"
          ) as HTMLIFrameElement;
          if (iframe) insertMD(mdArea.value);
        },
        false
      );
    return message;
  };

  saveMarkdown = async (data: string) => {
    if (this.saveRequestRunning) return;

    this.saveRequestRunning = true;
    let blob = new Blob([data]);

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

  stopEdit = () => {
    this.currentFileId = null;
  };
}

async function insertMD(data: string) {
  const iframe = window.parent.document.getElementById(
    "md-iframe"
  ) as HTMLIFrameElement;
  if (iframe) {
    const result = md.render(data);
    let iframeWindow = iframe.contentWindow as Window;

    let hlStyles = iframeWindow.document.createElement("link");
    hlStyles.rel = "stylesheet";
    hlStyles.href = markdownIt.dark
      ? properties.dark_hlstyles_url
      : properties.hlstyles_url;
    let styles = iframeWindow.document.createElement("link");
    styles.rel = "stylesheet";
    styles.href = properties.styles_url;
    let bodyStyle = iframeWindow.document.createElement("style");
    bodyStyle.innerHTML = markdownIt.dark
      ? properties.dark_bodystyle
      : properties.bodystyle;
    iframeWindow.document.head.innerHTML = "";
    iframeWindow.document.head.appendChild(hlStyles);
    iframeWindow.document.head.appendChild(styles);
    iframeWindow.document.head.appendChild(bodyStyle);

    linkControl(iframeWindow);

    let mdBody = iframeWindow.document.createElement("div");
    mdBody.id = "markdown-body";
    mdBody.innerHTML = result;
    iframeWindow.document.body.innerHTML = "";
    iframeWindow.document.body.appendChild(mdBody);
    iframe.style.height =
      iframe.contentWindow?.document.documentElement.scrollHeight + "px";
    setTimeout(function () {
      iframe.style.height =
        iframe.contentWindow?.document.documentElement.scrollHeight + "px";
    }, 200);
  } else {
    setTimeout(function () {
      insertMD(data);
    }, 50);
  }
}

function updateMD(data: string) {
  const iframe = window.parent.document.getElementById(
    "md-iframe"
  ) as HTMLIFrameElement;
  if (iframe) {
    let body = iframe.contentWindow?.document.getElementById("markdown-body");
    if (body) {
      let result = md.render(data);
      body.innerHTML = result;
      iframe.style.height =
        iframe.contentWindow?.document.documentElement.scrollHeight + "px";
    }
  }
}

function linkControl(iFrameWindow: Window) {
  const iframeDocument = iFrameWindow.document;
  iframeDocument.addEventListener("click", function (event) {
    let element = event.target as HTMLAnchorElement;
    if (element.tagName === "A") {
      iFrameWindow.open(element.href, "_blank");
      event.preventDefault();
    }
  });
}

function setSizes(editor: boolean, mobile: boolean) {
  editorBody.widthProp = viewerBody.widthProp = mobile
    ? "calc(100% - 20px)"
    : "95vw";
  editorBody.heightProp = viewerBody.heightProp = mobile
    ? "calc(100% - 25px)"
    : "78vh";
  editorBody.paddingProp = viewerBody.paddingProp = mobile ? "10px" : "0";
  iframeBox.heightProp = editor
    ? "calc(100% - 32px)"
    : mobile
    ? "calc(100% - 42px)"
    : "100%";
}
// for backward compatibility with old versions docspace
function resizeTextArea() {
  const area = window.parent.document.getElementsByName(
    "md-plugin-textarea"
  )[0] as HTMLIFrameElement;
  if (area)
    // @ts-ignore
    area.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.style.maxWidth =
      "100%";
}

function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
    userAgent
  );
}

const markdownIt = new Markdownit();

export default markdownIt;
