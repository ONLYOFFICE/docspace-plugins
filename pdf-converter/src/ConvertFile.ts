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
  FilesExst,
  IMessage,
  PluginStatus,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import ConvertApi from "convertapi-js";

import plugin from ".";
import { nameInputProps } from "./Dialog/Name";
import { convertFileDialog } from "./Dialog";

interface IFileInfo {
  viewUrl: string;
  folderId: number;
  fileExst: string;
}

class ConvertFile {
  currentFileId: number | null = null;
  fileInfo: IFileInfo | null = null;

  apiToken: string | null = null;

  apiURL = "";

  setCurrentFileId = (value: number | null) => {
    this.currentFileId = value;
  };

  setFileInfo = (value: IFileInfo | null) => {
    this.fileInfo = value;
  };

  setAPIUrl = (url: string) => {
    this.apiURL = url;
  };

  setAPIToken = (token: null | string) => {
    this.apiToken = token;
  };

  createAPIUrl = () => {
    const api = plugin.getAPI();

    this.apiURL = api.origin.replace(/\/+$/, "");

    const params = [api.proxy, api.prefix];

    params.forEach((part) => {
      if (!part) return;
      const newPart = part.trim().replace(/^\/+/, "");
      this.apiURL += newPart
        ? this.apiURL.length > 0 && this.apiURL[this.apiURL.length - 1] === "/"
          ? newPart
          : `/${newPart}`
        : "";
    });
  };

  getAPIUrl = () => {
    return this.apiURL;
  };

  onOpenModalDialog = async (id: number) => {
    if (!this.apiToken) return {};

    if (!this.apiURL) this.createAPIUrl();

    this.setCurrentFileId(id);

    const { viewUrl, folderId, fileExst, title } = await (
      await (await fetch(`${this.apiURL}/files/file/${id}`)).json()
    ).response;

    this.setFileInfo({ viewUrl, fileExst, folderId });

    nameInputProps.value = title?.split(".")[0];

    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: convertFileDialog,
    };

    return message;
  };

  onConvertFileClick = async (fileName: string) => {
    if (!this.apiToken) return {};

    if (!this.fileInfo || !fileName) return {};

    const { viewUrl, folderId, fileExst } = this.fileInfo;

    const data = await fetch(viewUrl);

    const dataBlob = await data.blob();

    const file = new File([dataBlob], `test${fileExst}`);

    const convertApi = ConvertApi.auth(this.apiToken);

    const params = convertApi.createParams();
    params.add("file", file);

    const result = await convertApi.convert(
      fileExst.split(".")[1],
      "pdf",
      params
    );

    const url = result.files[0].Url;

    const newFile = await fetch(url);

    const newBlob = await newFile.blob();

    const pdfFile = new File([newBlob], `blob`, {
      type: "",
      lastModified: new Date().getTime(),
    });

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const sessionRes = await fetch(
        `${this.apiURL}/files/${folderId}/upload/create_session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            createOn: new Date(),
            fileName: `${fileName}.pdf`,
            fileSize: pdfFile.size,
            relativePath: "",
          }),
        }
      );

      const sessionData = (await sessionRes.json()).response.data;

      await fetch(`${sessionData.location}`, {
        method: "POST",
        body: formData,
      });
    } catch (e) {
      console.log(e);
    }

    const toastTitle = `File "${fileName}${FilesExst.pdf}" was created`;

    const message: IMessage = {
      actions: [Actions.showToast, Actions.closeModal],
      toastProps: [
        {
          type: ToastType.success,
          title: toastTitle,
        },
      ],
    };

    return message;
  };

  fetchAPIToken = async () => {
    const apiToken = localStorage.getItem("pdf-converter-api-token");

    if (!apiToken) return;

    this.setAPIToken(apiToken);
    plugin.updateStatus(PluginStatus.active);
  };

  saveAPIToken = (apiToken: string) => {
    localStorage.setItem("pdf-converter-api-token", apiToken);

    plugin.updateStatus(!!apiToken ? PluginStatus.active : PluginStatus.hide);
  };
}

const convertFile = new ConvertFile();

export default convertFile;
