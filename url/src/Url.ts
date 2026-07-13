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
import { Actions, IMessage, IToast, ToastType, File } from "@onlyoffice/docspace-plugin-sdk";
import { i18n } from "./locales";

class UrlPlugin {
  apiURL: string = "";
  currentFolderId: number | null = null;
  currentFileId: number | string | null = null;
  saveRequestRunning: boolean = false;

  setCurrentFolderId = (id: number | null) => {
    this.currentFolderId = id;
  };

  setCurrentFileId = (id: number | string | null) => {
    this.currentFileId = id;
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

  createNewFile = async (title: string, url: string) => {
    if (!this.apiURL) this.createAPIUrl();

    const blob = new Blob([`[InternetShortcut]\nURL=${url}`]);
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
          fileName: `${title}.url`,
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
      return null;
    }
  };

  saveFile = async (url: string, title?: string) => {
    if (this.saveRequestRunning) return;

    this.saveRequestRunning = true;
    let blob = new Blob([`[InternetShortcut]\nURL=${url}`]);

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

      console.log("title", title);
      if (title) {
        await fetch(`${this.apiURL}/files/file/${this.currentFileId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            title,
          }),
        });
      }

      this.saveRequestRunning = false;
      return true;
    } catch (e) {
      this.saveRequestRunning = false;
      console.log(e);
      return false;
    }
  };

  getFile = async (id: File | any): Promise<string | { info: File; data: string }> => {
    if (!this.apiURL) this.createAPIUrl();

    let file = id;

    if (!id.fileExst) {
      file = (await (await fetch(`${this.apiURL}/files/file/${id}`)).json()).response;
    }

    if (!file.security?.Download) {
      return i18n.t("toast_no_permissions");
    }

    const data = await fetch(file.viewUrl);

    if (data.status !== 200) {
      return i18n.t("toast_cant_read_file");
    }

    const dataBlob = await data.blob();
    const dataText = await dataBlob.text();

    return { info: file, data: dataText };
  };

  openUrl = async (id: File | any) => {
    const file = await this.getFile(id);

    if (typeof file === "string") {
      return {
        actions: [Actions.showToast],
        toastProps: [
          {
            type: ToastType.error,
            title: file,
          } as IToast,
        ],
      } as IMessage;
    }

    try {
      const url = file.data
        .split("\n")
        .filter((line) => line.startsWith("URL="))[0]
        .split("=")
        .slice(1)
        .join("=");

      window.open(url, "_blank");

      return {};
    } catch {
      return {
        actions: [Actions.showToast],
        toastProps: [
          {
            type: ToastType.error,
            title: i18n.t("toast_wrong_file"),
          },
        ],
      } as IMessage;
    }
  };
}

const urlPlugin = new UrlPlugin();

export default urlPlugin;
