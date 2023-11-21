/*
 * (c) Copyright Ascensio System SIA 2023
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
  File,
  IMessage,
  IToast,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import plugin from ".";
import { drawIoModalDialogProps, frameProps } from "./DrawIO/Dialog";
import DiagramEditor from "./DrawIO/Editor";

const frameId = "drawio-frame";

const emptyDiagram = `
<mxfile host="embed.diagrams.net" modified="2023-07-27T16:42:50.678Z" agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36" etag="EZ9YBFL-_pSvUl0KVY1h" version="21.6.5" type="embed">
  <diagram id="emYRSDDRkDP2Yd3EZy3r" name="Page-1">
    <mxGraphModel dx="1298" dy="921" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="0" page="0" pageScale="1" pageWidth="826" pageHeight="1169" background="none" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" style="" parent="0" />
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

class DrawIo {
  adminSettings = {
    url: "https://embed.diagrams.net",
    lang: "auto",
    off: false,
    lib: false,
  };

  userSettings = {
    theme: "default",
    dark: "auto",
  };

  saveRequestRunning = false;

  currentFolderId: number | null = null;

  currentFileId: number | null = null;
  saveWithCreateNewFile: boolean = false;

  apiURL: string = "";

  setCurrentFolderId = (id: number | null) => {
    this.currentFolderId = id;
  };

  getCurrentFolderId = () => {
    return this.currentFolderId;
  };

  setUrl = (url: string) => {
    this.adminSettings.url = url;
  };

  setLang = (lang: string) => {
    this.adminSettings.lang = lang;
  };

  setOff = (off: boolean) => {
    this.adminSettings.off = off;
  };

  setLib = (lib: boolean) => {
    this.adminSettings.lib = lib;
  };

  validateAdminSettings = (
    url: string,
    lang: { key: string },
    off: boolean,
    lib: boolean
  ) => {
    if (!url) return false;

    const isSameUrl = url === this.adminSettings.url;
    const isSameLang = lang?.key === this.adminSettings.lang;
    const isSameOff = off === this.adminSettings.off;
    const isSameLib = lib === this.adminSettings.lib;

    if (isSameUrl && isSameLang && isSameOff && isSameLib) return false;

    return true;
  };

  setAdminSettings = (
    url: string | null,
    lang: { key: string } | null,
    off: boolean | null,
    lib: boolean | null
  ) => {
    url && this.setUrl(url);
    lang?.key && this.setLang(lang?.key);
    off && this.setOff(off);
    lib && this.setLib(lib);
  };

  getAdminSettings = () => {
    return JSON.stringify(this.adminSettings);
  };

  setTheme = (theme: string) => {
    this.userSettings.theme = theme;
  };

  setDark = (dark: string) => {
    this.userSettings.dark = dark;
  };

  validateUserSettings = (theme: string, dark: string) => {
    const isSameTheme = theme === this.userSettings.theme;
    const isSameDark = dark === this.userSettings.dark;

    if (isSameTheme && isSameDark) return false;

    return true;
  };

  setUserSettings = (theme: string, dark: string) => {
    this.setTheme(theme);
    this.setDark(dark);
  };

  getUserSettings = () => {
    return this.userSettings;
  };

  onLoad = async () => {
    if (!this.apiURL) this.createAPIUrl();
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

    const blob = new Blob([emptyDiagram]);
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
            fileName: `${value}.drawio`,
            fileSize: file.size,
            relativePath: "",
          }),
        }
      );

      const sessionData = (await sessionRes.json()).response.data;

      const data = await fetch(`${sessionData.location}`, {
        method: "POST",
        body: formData,
      });

      const { id: fileId } = (await data.json()).data;

      return fileId;
    } catch (e) {
      console.log(e);
    }
  };

  openFileFromUrl = async (title: string, src: string) => {
    const fileId = await this.createNewFile(title);

    this.currentFileId = fileId;

    //@ts-ignore
    const editor = new DiagramEditor(
      this.userSettings.theme,
      this.userSettings.dark,
      this.adminSettings.off,
      this.adminSettings.lib,
      this.adminSettings.lang,
      this.adminSettings.url
    );

    editor.startEditing(null, null, title, frameId, src);

    drawIoModalDialogProps.dialogHeader = title;

    drawIoModalDialogProps.eventListeners = [
      {
        name: "message",
        onAction: editor.handleMessageEvent,
      },
    ];

    frameProps.src = editor.getFrameUrl();
    frameProps.id = frameId;

    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: drawIoModalDialogProps,
    };

    return message;
  };

  editDiagram = async (propFile: File) => {
    if (!this.apiURL) this.createAPIUrl();

    try {
      let file = propFile;

      if (!propFile.fileExst) {
        file = (
          await (
            await fetch(`${this.apiURL}/files/file/${propFile.id || propFile}`)
          ).json()
        ).response;
      }

      if (file.fileExst !== ".drawio" && file.fileExst !== ".png") {
        return {
          actions: [Actions.showToast],
          toastProps: [
            { type: ToastType.error, title: "Wrong file format" } as IToast,
          ],
        };
      }

      const userRes = (
        await (await fetch(`${this.apiURL}/people/@self`)).json()
      ).response;

      const { theme } = userRes;

      //@ts-ignore
      const { title, security } = file;

      const showSaveButton =
        security?.edit || //@ts-ignore
        file.access === 0 || //@ts-ignore
        file.access === 1 || //@ts-ignore
        file.access === 10 || //@ts-ignore
        file.access === 11;

      this.currentFileId = file.id;

      const data = await fetch(file.viewUrl);

      const dataBlob = await data.blob();

      if (file.fileExst === ".drawio") {
        const dataText = await dataBlob.text();

        const message = this.openEditor(
          dataText,
          "xml",
          title.replace(".drawio", ""),
          theme,
          showSaveButton
        );

        return message;
      } else {
        return new Promise<IMessage>((resolve) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              const message: IMessage = this.openEditor(
                reader.result,
                "xmlpng",
                title.replace(".png", ""),
                theme,
                showSaveButton
              );
              return resolve(message);
            }

            return {} as IMessage;
          };
          reader.readAsDataURL(dataBlob);
        });
      }
    } catch (e) {
      console.log(e);
      return {};
    }
  };

  openEditor = (
    data: string,
    format: string,
    title: string,
    theme: string,
    showSaveButton: boolean
  ): IMessage => {
    let dark = this.userSettings.dark;
    let lang = this.adminSettings.lang;

    if (dark === "auto") {
      if (theme === "Base") dark = "0";
      if (theme === "Dark") dark = "1";
    }

    if (lang === "auto") {
      lang = document.cookie.replace("asc_language=", "");
    }

    //@ts-ignore
    const editor = new DiagramEditor(
      this.userSettings.theme,
      dark,
      this.adminSettings.off,
      this.adminSettings.lib,
      lang,
      this.adminSettings.url,
      showSaveButton
    );

    editor.startEditing(data, format, title, frameId);

    drawIoModalDialogProps.dialogHeader = title;

    drawIoModalDialogProps.eventListeners = [
      {
        name: "message",
        onAction: editor.handleMessageEvent,
      },
    ];

    frameProps.src = editor.getFrameUrl();
    frameProps.id = frameId;

    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: drawIoModalDialogProps,
    };

    return message;
  };

  saveDiagram = async (content: string, draft: boolean, isExport: boolean) => {
    if (this.saveRequestRunning || !this.currentFileId) return;

    this.saveRequestRunning = true;
    let blob = new Blob([content]);

    if (isExport) {
      await fetch(content).then(async (res) => (blob = await res.blob()));
    }

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
    } catch (e) {
      this.saveRequestRunning = false;
    }
  };

  stopEditDiagram = () => {
    this.currentFileId = null;
  };
}

const drawIo = new DrawIo();

export default drawIo;
