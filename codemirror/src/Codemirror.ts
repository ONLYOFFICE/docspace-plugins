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
import { Actions, IToast, ToastType, IMessage } from "@onlyoffice/docspace-plugin-sdk";
import { unsavedModalDialog, reopenButton } from "./Dialog/Unsaved";
import { codemirrorModalDialogProps, saveButton, cancelButton, footerBox } from "./Dialog";
import { getExtensions } from "./Extensions";
import { EditorState } from "@codemirror/state";
import { EditorView } from "codemirror";
import { docSpaceTheme } from "./Extensions";
import { getCodemirrorBody } from "./Utils";

// TODO: [DS] html creates with corrupted data + cant open after close
// TODO: add XML

class Codemirror {
  view: EditorView | null = null;
  apiURL: string = "";
  currentFileId: number | null = null;
  currentFileData: string | undefined = undefined;
  currentFolderId: number | null = null;
  saveRequestRunning: boolean = false;

  settings = {
    highlightWhitespace: false,
    highlightTrailingWhitespace: false,
    autoCloseTags: true,
  };

  setSettings = (
    highlightWhitespace: boolean | null,
    highlightTrailingWhitespace: boolean | null,
    autoCloseTags: boolean | null
  ) => {
    highlightWhitespace !== null && this.setHighlightWhitespace(highlightWhitespace);
    highlightTrailingWhitespace !== null && this.setHighlightTrailingWhitespace(highlightTrailingWhitespace);
    autoCloseTags !== null && this.setAutoCloseTags(autoCloseTags);
  };

  getSettings = () => {
    return JSON.stringify(this.settings);
  };

  setHighlightTrailingWhitespace = (highlightTrailingWhitespace: boolean) => {
    this.settings.highlightTrailingWhitespace = highlightTrailingWhitespace;
  };

  setHighlightWhitespace = (highlightWhitespace: boolean) => {
    this.settings.highlightWhitespace = highlightWhitespace;
  };

  setAutoCloseTags = (autoCloseTags: boolean) => {
    this.settings.autoCloseTags = autoCloseTags;
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

  setCurrentFolderId = (id: number | null) => {
    this.currentFolderId = id;
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
      const sessionRes = await fetch(`${this.apiURL}/files/${this.currentFolderId}/upload/create_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          createOn: new Date(),
          fileName: value,
          fileSize: file.size,
          relativePath: "",
          CreateNewIfExist: true,
        }),
      });

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

  openFile = async (id: File | any) => {
    if (!this.apiURL) this.createAPIUrl();

    let file = id;

    if (!id.fileExst) {
      file = (await (await fetch(`${this.apiURL}/files/file/${id.id || id}`)).json()).response;
    }

    const userRes = (await (await fetch(`${this.apiURL}/people/@self`)).json()).response;

    const theme = docSpaceTheme(userRes.theme);

    const { access, security, title } = file;

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

    const showSaveButton =
      security?.Edit || access === 0 || access === 1 || access === 9 || access === 10 || access === 11;

    this.currentFileId = file.id;

    const data = await fetch(file.viewUrl);

    if (data.status !== 200) {
      return {
        actions: [Actions.showToast],
        toastProps: [{ type: ToastType.error, title: "Can't read this file" } as IToast],
      };
    }

    fetch(`${this.apiURL}/files/file/${file.id}/recent`, {
      method: "POST",
      body: JSON.stringify({
        fileIds: [file.id],
      }),
    });

    const dataBlob = await data.blob();
    this.currentFileData = await dataBlob.text();

    const onSave = async () => {
      const message: IMessage = {
        actions: [Actions.showToast],
      };

      const success = await this.savefile();
      switch (success) {
        case true:
          message.toastProps = [{ type: ToastType.success, title: "File saved" }];
          this.currentFileData = this.view!.state.doc.toString();
          break;
        case false:
          message.toastProps = [{ type: ToastType.error, title: "Failed to save file" }];
          break;
        case undefined:
          message.actions = [];
          break;
      }

      return message;
    };
    const onClose = () => {
      const message: IMessage = {};
      if (!this.saveRequestRunning) {
        message.actions = [Actions.closeModal];
        if (this.view?.state.doc.toString() !== this.currentFileData) {
          message.actions.push(Actions.showModal);
          reopenButton.onClick = async () => {
            const message: IMessage = {
              actions: [Actions.closeModal, Actions.showModal],
              modalDialogProps: codemirrorModalDialogProps,
            };

            this.openCodemirror(this.view!.state.doc.toString(), file.fileExst, showSaveButton, theme);
            return message;
          };
          message.modalDialogProps = unsavedModalDialog;
        }
      }
      return message;
    };

    saveButton.onClick = onSave;
    cancelButton.onClick = onClose;
    codemirrorModalDialogProps.onClose = onClose;
    codemirrorModalDialogProps.dialogHeader = title;
    codemirrorModalDialogProps.dialogFooter = showSaveButton ? footerBox : undefined;

    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: codemirrorModalDialogProps,
    };

    this.openCodemirror(this.currentFileData, file.fileExst, showSaveButton, theme);
    return message;
  };

  openCodemirror = (data: string, fileExt: string, isEditor: boolean, theme: any[]) => {
    const iFrame = window.parent.document.getElementById("codemirror-plugin-iframe") as HTMLIFrameElement;
    if (!iFrame) {
      setTimeout(() => {
        this.openCodemirror(data, fileExt, isEditor, theme);
      }, 50);
      return;
    }

    const body = getCodemirrorBody(iFrame, theme);

    const extensions = getExtensions(fileExt.replace(".", ""), this.settings);

    this.view = new EditorView({
      parent: body,
      doc: data,
      extensions: [...extensions, ...theme, EditorState.readOnly.of(!isEditor)],
    });
  };

  savefile = async () => {
    if (this.saveRequestRunning) return;

    const data = this.view!.state.doc.toString();

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
      console.error(e);
      return false;
    }
  };
}

const codemirror = new Codemirror();

export default codemirror;
