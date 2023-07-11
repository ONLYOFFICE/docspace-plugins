import {
  Actions,
  FilesExst,
  IMessage,
  PluginStatus,
  ToastType,
} from "onlyoffice-docspace-plugin";

import plugin from ".";
import { convertFileItem } from "./ContextMenuItem";

export type UserSettingsValue = {
  fileName: string;
  formats: FilesExst[];
  mockApi: boolean;
  localStorage: boolean;
};

export type AdminSettingsValue = {
  pdf: boolean;
  txt: boolean;
};

class ConvertFile {
  userSettingsValue: UserSettingsValue = {
    fileName: "",
    formats: [],
    mockApi: false,
    localStorage: false,
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

        this.setUserSettingsValue({
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

      this.setUserSettingsValue({ ...value });
      return value;
    }

    return null;
  };

  fetchAdminSettingsValue = async () => {
    if (!this.apiURL) {
      this.createAPIUrl();
    }

    const data = await (
      await fetch(`https://64a67577096b3f0fcc7fd1f7.mockapi.io/users`)
    ).json();

    if (data.length > 0) {
      const value: AdminSettingsValue = data.find(
        (d: any) => d.userId === "general-settings"
      );

      if (value) {
        this.setAdminSettingsValue({ pdf: value.pdf, txt: value.txt });

        return { pdf: value.pdf, txt: value.txt };
      }

      return null;
    }

    return null;
  };

  onLoad = async () => {
    const actions = [
      this.fetchUserSettingsValue(),
      this.fetchAdminSettingsValue(),
    ];

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

    if (!value.localStorage && !value.mockApi) return message;

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

    return message;
  };

  acceptAdminSettings = async (value: AdminSettingsValue) => {
    if (!this.apiURL) {
      this.createAPIUrl();
    }

    const data = await (
      await fetch(`https://64a67577096b3f0fcc7fd1f7.mockapi.io/users`)
    ).json();

    if (data.length > 0) {
      const v: any = data.find((d: any) => d.userId === "general-settings");

      if (v) {
        await fetch(
          `https://64a67577096b3f0fcc7fd1f7.mockapi.io/users/${v.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
              ...v,
              pdf: value.pdf,
              txt: value.txt,
            }),
          }
        );

        return;
      }
    }

    await fetch(`https://64a67577096b3f0fcc7fd1f7.mockapi.io/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        userId: "general-settings",
        ...value,
      }),
    });
  };
}

const convertFile = new ConvertFile();

export default convertFile;
