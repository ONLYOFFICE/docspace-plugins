import {
  Actions,
  FilesExst,
  IMessage,
  PluginStatus,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

import { convertFileItem } from "./ContextMenuItem";

import plugin from ".";

export type UserSettingsValue = {
  fileName: string;
  formats: FilesExst[];
};

export type AdminSettingsValue = {
  pdf: boolean;
  txt: boolean;
};

class ConvertFile {
  userSettingsValue: UserSettingsValue = {
    fileName: "",
    formats: [],
  };

  adminSettingsValue: AdminSettingsValue = {
    pdf: true,
    txt: true,
  };

  acceptFromModalSettings = false;
  currentFileId: number | null = null;

  apiURL = "";

  setAcceptFromModalSettings = (value: boolean) => {
    this.acceptFromModalSettings = value;
  };

  setCurrentFileId = (value: number | null) => {
    this.currentFileId = value;
  };

  setUserSettingsValue = (value: UserSettingsValue) => {
    this.userSettingsValue = value;

    convertFileItem.fileExt = value.formats;

    plugin.updateContextMenuItem(convertFileItem);
  };

  getUserSettingsValue = () => {
    return this.userSettingsValue;
  };

  setAdminSettingsValue = (value: AdminSettingsValue) => {
    this.adminSettingsValue = value;
  };

  getAdminSettingsValue = () => {
    return this.adminSettingsValue;
  };

  fetchUserSettingsValue = async () => {
    if (!this.apiURL) {
      this.createAPIUrl();
    }

    const user = await this.getUser();

    const localValue = localStorage.getItem(`${user.id}-convert-file-plugin`);

    const value = !!localValue && JSON.parse(localValue);

    if (value) {
      plugin.updateStatus(PluginStatus.active);

      this.setUserSettingsValue({ ...value });
      return value;
    }

    return null;
  };

  fetchAdminSettingsValue = async () => {
    const localValue = localStorage.getItem(`admin-convert-file-plugin`);

    const value = !!localValue && JSON.parse(localValue);

    if (value) {
      plugin.updateStatus(PluginStatus.active);

      this.setAdminSettingsValue({ ...value });
      return value;
    }

    return null;
  };

  onLoad = async () => {
    const actions = [
      this.fetchUserSettingsValue(),
      this.fetchAdminSettingsValue(),
    ];

    this.fetchUserSettingsValue();

    await Promise.all(actions);
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

  onConvertFileClick = async (id: number) => {
    this.setCurrentFileId(null);
    this.setAcceptFromModalSettings(false);

    const pluginStatus = plugin.getStatus();

    if (!this.adminSettingsValue.pdf && !this.adminSettingsValue.txt) {
      const message: IMessage = {
        actions: [Actions.showToast],
        toastProps: [
          {
            type: ToastType.warning,
            title: "DocSpace admin or DocSpace owner need enter settings",
          },
        ],
      };

      return message;
    }

    if (
      pluginStatus === PluginStatus.pending ||
      pluginStatus === PluginStatus.hide ||
      !this.userSettingsValue.fileName
    ) {
      const message: IMessage = {
        actions: [Actions.showSettingsModal],
      };

      this.setAcceptFromModalSettings(true);
      this.setCurrentFileId(id);

      return message;
    }

    const { webUrl, folderId, fileExst } = (
      await (await fetch(`${this.apiURL}/files/file/${id}`)).json()
    ).response;

    if (!this.userSettingsValue.formats.includes(fileExst)) {
      const message: IMessage = {
        actions: [Actions.showSettingsModal],
      };

      this.setAcceptFromModalSettings(true);
      this.setCurrentFileId(id);

      return message;
    }

    const url = new URL(`${this.apiURL}/filehandler.ashx`);

    url.searchParams.append("action", "create");
    url.searchParams.append("fileuri", webUrl);
    url.searchParams.append("folderid", folderId);
    url.searchParams.append("response", "message");

    const actions = [];

    if (this.adminSettingsValue.pdf) {
      url.searchParams.append(
        "title",
        `${this.userSettingsValue.fileName}${FilesExst.pdf}`
      );

      actions.push(fetch(url.toString()));
    }

    if (this.adminSettingsValue.txt) {
      url.searchParams.set(
        "title",
        `${this.userSettingsValue.fileName}${FilesExst.txt}`
      );

      actions.push(fetch(url.toString()));
    }

    await Promise.all(actions);

    const toastTitle =
      this.adminSettingsValue.pdf && this.adminSettingsValue.txt
        ? `Files were created`
        : this.adminSettingsValue.pdf
        ? `File "${this.userSettingsValue.fileName}${FilesExst.pdf}" was created`
        : `File "${this.userSettingsValue.fileName}${FilesExst.txt}" was created`;

    const message: IMessage = {
      actions: [Actions.showToast],
      toastProps: [
        {
          type: ToastType.success,
          title: toastTitle,
        },
      ],
    };

    return message;
  };

  getUser = async () => {
    if (!this.apiURL) {
      this.createAPIUrl();
    }

    const userRes = await fetch(`${this.apiURL}/people/@self`);

    const user = (await userRes.json()).response;

    return user;
  };

  acceptUserSettings = async (value: UserSettingsValue) => {
    if (!this.apiURL) {
      this.createAPIUrl();
    }

    plugin.updateStatus(PluginStatus.active);

    let message = null;

    if (this.acceptFromModalSettings && !!this.currentFileId) {
      message = await this.onConvertFileClick(this.currentFileId);
    }

    const user = await this.getUser();

    const localStorageValue = JSON.stringify(value);

    localStorage.setItem(`${user.id}-convert-file-plugin`, localStorageValue);

    return message;
  };

  acceptAdminSettings = async (value: AdminSettingsValue) => {
    if (!this.apiURL) {
      this.createAPIUrl();
    }

    const localStorageValue = JSON.stringify(value);

    localStorage.setItem(`admin-convert-file-plugin`, localStorageValue);
  };
}

const convertFile = new ConvertFile();

export default convertFile;
