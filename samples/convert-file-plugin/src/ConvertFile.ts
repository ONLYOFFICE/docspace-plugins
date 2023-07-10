import {
  Actions,
  FilesExst,
  IMessage,
  PluginStatus,
  ToastType,
} from "onlyoffice-docspace-plugin";

import plugin from ".";
import { convertFileItem } from "./ContextMenuItem";

export type SettingsValue = {
  fileName: string;
  formats: FilesExst[];
  mockApi: boolean;
  localStorage: boolean;
};

class ConvertFile {
  settingsValue: SettingsValue = {
    fileName: "",
    formats: [],
    mockApi: false,
    localStorage: false,
  };

  apiURL = "";

  setSettingsValue = (value: SettingsValue) => {
    this.settingsValue = value;

    convertFileItem.fileExt = value.formats;

    plugin.updateContextMenuItem(convertFileItem);
  };

  getSettingsValue = () => {
    return this.settingsValue;
  };

  fetchSettingsValue = async () => {
    if (!this.apiURL) {
      this.createAPIUrl();
    }

    const user = await this.getUser();

    const localValue = localStorage.getItem(`${user.id}-new-file-name`);

    const users = await (
      await fetch(`https://64a67577096b3f0fcc7fd1f7.mockapi.io/users`)
    ).json();

    if (users.length > 0) {
      const value = users.find((u: any) => u.userId === user.id);

      if (value) {
        const formats = [];

        if (value.docx) formats.push(FilesExst.docx);

        if (value.xlsx) formats.push(FilesExst.xlsx);

        plugin.updateStatus(PluginStatus.active);

        this.setSettingsValue({
          fileName: value.fileName,
          formats,
          mockApi: value.mockApi,
          localStorage: value.localStorage,
        });

        return {
          fileName: value.fileName,
          formats,
          mockApi: value.mockApi,
          localStorage: value.localStorage,
        };
      }
    }

    const value = !!localValue && JSON.parse(localValue);

    if (value) {
      plugin.updateStatus(PluginStatus.active);

      this.setSettingsValue({ ...value });
      return value;
    }

    return null;
  };

  onLoad = async () => {
    await this.fetchSettingsValue();
  };

  setAPIUrl = (url: string) => {
    this.apiURL = url;
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

  onConvertFileClick = async (id: number, filesExst: string) => {
    const pluginStatus = plugin.getStatus();

    if (
      pluginStatus === PluginStatus.pending ||
      pluginStatus === PluginStatus.hide ||
      !this.settingsValue.fileName
    ) {
      const message: IMessage = {
        actions: [Actions.showToast],
        toastProps: {
          type: ToastType.warning,
          title: "Need enter settings",
        },
      };

      return message;
    }

    const { webUrl, folderId } = (
      await (await fetch(`${this.apiURL}/files/file/${id}`)).json()
    ).response;

    const url = new URL(`${this.apiURL}/filehandler.ashx`);

    url.searchParams.append("action", "create");
    url.searchParams.append("fileuri", webUrl);
    url.searchParams.append("folderid", folderId);

    url.searchParams.append(
      "title",
      `${this.settingsValue.fileName}${FilesExst.pdf}`
    );
    url.searchParams.append("response", "message");

    await fetch(url.toString());

    const message: IMessage = {
      actions: [Actions.showToast],
      toastProps: {
        type: ToastType.success,
        title: `File "${this.settingsValue.fileName}${FilesExst.pdf}" was created`,
      },
    };

    return message;
  };

  getUser = async () => {
    const userRes = await fetch(`${this.apiURL}/people/@self`);

    const user = (await userRes.json()).response;

    return user;
  };

  acceptSettings = async (value: SettingsValue) => {
    if (!this.apiURL) {
      this.createAPIUrl();
    }

    plugin.updateStatus(PluginStatus.active);

    const user = await this.getUser();

    if (value.localStorage) {
      const localStorageValue = JSON.stringify(value);

      localStorage.setItem(`${user.id}-new-file-name`, localStorageValue);
    } else {
      localStorage.removeItem(`${user.id}-new-file-name`);
    }

    if (value.mockApi) {
      await fetch(`https://64a67577096b3f0fcc7fd1f7.mockapi.io/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          userId: user.id,
          fileName: value.fileName,
          docx: value.formats.includes(FilesExst.docx),
          xlsx: value.formats.includes(FilesExst.xlsx),
          localStorage: value.localStorage,
          mockApi: value.mockApi,
        }),
      });
    } else {
      const users = await (
        await fetch(`https://64a67577096b3f0fcc7fd1f7.mockapi.io/users`)
      ).json();

      if (users.length > 0) {
        const userId = users.find((u: any) => u.userId === user.id).id;

        await fetch(
          `https://64a67577096b3f0fcc7fd1f7.mockapi.io/users/${userId}`,
          {
            method: "DELETE",
          }
        );
      }
    }
  };
}

const convertFile = new ConvertFile();

export default convertFile;
