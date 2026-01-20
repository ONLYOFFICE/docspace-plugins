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
  IMessage,
  IToast,
  ToastType,
  IPostMessageCallbackMessage,
  TFilesSelector,
} from "@onlyoffice/docspace-plugin-sdk";
import plugin from ".";
import * as fflate from "fflate";
import { modalDialogProps, frameProps, extractButton } from "./ModalDialog";
import { drawInIframe, loader, viewer } from "./ModalDialog/Viewer";
import { selectorProps } from "./ModalDialog/Selector";
import { i18n } from "./locales";

class Archives {
  apiURL: string = "";
  user: any = null;
  root: FileTreeItem[] = [];
  archiveBuffer: fflate.Zippable = {};
  currentFileId: number | undefined = undefined;
  destinationFolderId: number | undefined = undefined;
  currentArchiveFolderId: number | undefined = undefined;

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

  openZip = async (id: File | any, path: string = "") => {
    if (!this.apiURL) this.createAPIUrl();
    this.currentFileId = id;

    const file = await this.getFile(id);
    if (!this.user) {
      this.user = await this.getUser();
    }

    this.currentArchiveFolderId = file.folderId;

    if (!file.security?.Download) {
      return {
        actions: [Actions.showToast],
        toastProps: [{ type: ToastType.error, title: i18n.t("toast_no_view_permission") } as IToast],
      };
    }

    fetch(`${this.apiURL}/files/file/${file.id}/recent`, {
      method: "POST",
      body: JSON.stringify({
        fileIds: [file.id],
      }),
    });

    this.getContent(file.viewUrl, () => {
      drawInIframe(frameProps.id!, viewer, this.root, file.title, this.user.theme === "Dark", path);
    });

    extractButton.onClick = async () => {
      await this.unzip(file.folderId, this.root, file.title.split(".").slice(0, -1).join("."));

      return {
        actions: [Actions.closeModal],
      };
    };

    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: modalDialogProps,
    };

    drawInIframe(frameProps.id!, loader);
    return message;
  };

  openSelector = async (id: File | any, content?: FileTreeItem[], zipAction = false) => {
    const message: IPostMessageCallbackMessage = {
      actions: [Actions.showSelector],
      selectorProps: selectorProps(),
    };

    if (zipAction) {
      const folder = await this.getFolder(id);

      if (!folder.current.security.Download) {
        return {
          actions: [Actions.showToast],
          toastProps: [
            { type: ToastType.error, title: "You don't have permission to download files from this folder" } as IToast,
          ],
        } as IPostMessageCallbackMessage;
      }

      (message.selectorProps!.props as TFilesSelector).submitButtonLabel = "Archive";
      (message.selectorProps!.props as TFilesSelector).currentFolderId = folder.current.parentId;
      (message.selectorProps!.props as TFilesSelector).submitButtonLabel = "Archive";
      message.selectorProps!.props.onSubmit = async (params: any) => {
        const msg = await this.zipFolder(id, params.selectedItemId);

        if (msg.toastProps && msg.toastProps[0].type === ToastType.success) {
          msg.actions?.push(Actions.closeSelector);
        }

        return msg;
      };

      return message;
    }

    if (!content) {
      const file = await this.getFile(id);

      if (!file.security?.Download) {
        return {
          actions: [Actions.showToast],
          toastProps: [{ type: ToastType.error, title: i18n.t("toast_no_unzip_permission") } as IToast],
        } as IPostMessageCallbackMessage;
      }

      message.selectorProps!.props.headerProps!.label = "Unzip";
      (message.selectorProps!.props as TFilesSelector).currentFolderId = file.folderId;

      (message.selectorProps!.props as TFilesSelector).submitButtonLabel = "Unzip";
      message.selectorProps!.props.onSubmit = async (params: any) => {
        await this.getContent(file.viewUrl);
        const msg = await this.unzip(params.selectedItemId, this.root, file.title.split(".").slice(0, -1).join("."));
        msg.actions!.push(Actions.closeSelector);

        return msg;
      };
    } else {
      message.actions?.unshift(Actions.closeModal);

      const backToViewer = async () => {
        const msg = await this.openZip(this.currentFileId!, id);
        msg.actions?.unshift(Actions.closeSelector);
        return msg;
      };

      message.selectorProps!.props.headerProps!.label = "Extract";
      (message.selectorProps!.props as TFilesSelector).currentFolderId = this.currentArchiveFolderId;

      (message.selectorProps!.props as TFilesSelector).onCancel = backToViewer;
      message.selectorProps!.props.headerProps!.isCloseable = false;
      message.selectorProps!.props.headerProps!.withBackButton = true;
      message.selectorProps!.props.headerProps!.onBackClick = backToViewer;

      (message.selectorProps!.props as TFilesSelector).withFooterCheckbox = true;
      (message.selectorProps!.props as TFilesSelector).footerCheckboxLabel = "Put in a new folder";
      (message.selectorProps!.props as TFilesSelector).submitButtonLabel = "Extract";
      message.selectorProps!.props.onSubmit = async (params: any) => {
        let msg = await this.unzip(params.selectedItemId, content, params.isChecked ? "New folder" : undefined);

        if (msg.actions?.includes(Actions.showToast) && msg.toastProps![0].type != ToastType.success) {
          return msg;
        }

        msg = await backToViewer();
        msg.actions?.push(Actions.showToast);
        msg.toastProps = [{ type: ToastType.success, title: "Element(s) extracted successfully" } as IToast];

        return msg;
      };
    }

    return message;
  };

  unzip = async (folderId: File | number | any, content?: FileTreeItem[], wrapperFolder?: string) => {
    const createFolder = async (f: FileTreeItem): Promise<IMessage> => {
      const folderRes = await fetch(`${this.apiURL}/files/folder/${folderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          title: f.title,
        }),
      });

      const fId = (await folderRes.json()).response.id;

      return await this.unzip(fId, f.content as FileTreeItem[]);
    };

    if (!content) {
      const file = await this.getFile(folderId);

      if (!file.security?.Download) {
        return {
          actions: [Actions.showToast],
          toastProps: [{ type: ToastType.error, title: i18n.t("toast_no_unzip_permission") } as IToast],
        } as IMessage;
      }

      folderId = file.folderId;
      wrapperFolder = file.title.split(".").slice(0, -1).join(".");
      content = await this.getContent(file.viewUrl);
    }

    const folder = await this.getFolder(folderId);
    if (!folder.current.security.Create) {
      return {
        actions: [Actions.showToast],
        toastProps: [
          { type: ToastType.error, title: "Failed to unzip. You can't create files in this folder" } as IToast,
        ],
      };
    }

    if (wrapperFolder) {
      return await createFolder({ type: "folder", title: wrapperFolder, content: content! });
    }

    for (const f of content!) {
      if (f.type === "file") {
        const blob = new Blob([f.content as BlobPart]);
        const file = new File([blob], `blob`, {
          type: "",
          lastModified: new Date().getTime(),
        });

        const formData = new FormData();
        formData.append("file", file);

        const sessionRes = await fetch(`${this.apiURL}/files/${folderId}/upload/create_session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            createOn: new Date(),
            fileName: f.title,
            fileSize: file.size,
            relativePath: "",
            CreateNewIfExist: true,
          }),
        });

        const sessionData = (await sessionRes.json()).response.data;

        await (
          await fetch(`${sessionData.location}`, {
            method: "POST",
            body: formData,
          })
        ).json();
      } else {
        await createFolder(f);
      }
    }

    return {
      actions: [Actions.showToast],
      toastProps: [{ type: ToastType.success, title: i18n.t("toast_unzip_success") } as IToast],
    } as IMessage;
  };

  zipFolder = async (id: number | any[], folderId = undefined) => {
    if (!this.apiURL) this.createAPIUrl();

    let destination, fakeFolder;
    if (typeof id === "number") {
      destination = folderId
        ? await this.getFolder(folderId)
        : await this.getFolder((await this.getFolder(id)).current.parentId);
    } else {
      fakeFolder = await this.collectContent(id);
      destination = fakeFolder.parent;
    }

    if (!destination.current.security.Create) {
      return {
        actions: [Actions.showToast],
        toastProps: [
          { type: ToastType.error, title: i18n.t("toast_cant_create") } as IToast,
        ],
      };
    }

    this.archiveBuffer = {};
    const folder = await this.fetchContent(fakeFolder ? fakeFolder : id);

    const zip = fflate.zipSync(this.archiveBuffer);

    const blob = new Blob([zip as BlobPart]);

    const file = new File([blob], `blob`, {
      type: "",
      lastModified: new Date().getTime(),
    });

    const formData = new FormData();
    formData.append("file", file);

    const sessionRes = await fetch(`${this.apiURL}/files/${destination.current.id}/upload/create_session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        createOn: new Date(),
        fileName: `${folder.current?.title || i18n.t("default_zip_title")}.zip`,
        fileSize: file.size,
        relativePath: "",
        CreateNewIfExist: true,
      }),
    });

    if (!sessionRes.ok) {
      return {
        actions: [Actions.showToast],
        toastProps: [{ type: ToastType.error, title: i18n.t("toast_failed_to_create") } as IToast],
      };
    }

    const sessionData = (await sessionRes.json()).response.data;

    const data = await (
      await fetch(`${sessionData.location}`, {
        method: "POST",
        body: formData,
      })
    ).json();

    const message: IMessage = {
      actions: [Actions.showToast],
      toastProps: [{ type: ToastType.success, title: i18n.t("toast_zip_saved") } as IToast],
    };

    if (!data.success) {
      message.toastProps = [{ type: ToastType.error, title: i18n.t("toast_zip_not_saved") } as IToast];
      return message;
    }

    return message;
  };

  getContent = async (url: string, callback?: () => any) => {
    return fetch(url)
      .then((data) => {
        if (data.status !== 200) {
          throw new Error("Failed to fetch file");
        }
        return data.arrayBuffer();
      })
      .then((dataArrayBuffer) => {
        const dataUint8Array = new Uint8Array(dataArrayBuffer);
        const unzipped = fflate.unzipSync(dataUint8Array);
        this.root = buildFileTree(unzipped);

        if (callback) callback();

        return this.root;
      });
  };

  fetchContent = async (id: any, path: string = "") => {
    const folder = typeof id === "number" ? await this.getFolder(id) : id;
    if (path !== "") {
      this.archiveBuffer[path] = new Uint8Array();
    }

    const filePromises = [];
    for (const file of folder.files) {
      filePromises.push(
        fetch(file.viewUrl)
          .then((data) => {
            if (data.status !== 200) {
              throw new Error(`Failed to fetch '${file.title}'. Response status: ${data.status}`);
            }
            return data.arrayBuffer();
          })
          .then((dataArrayBuffer) => {
            this.archiveBuffer[`${path}${file.title}`] = new Uint8Array(dataArrayBuffer);
          })
      );
    }

    const recursivePromises = [];
    for (const f of folder.folders) {
      recursivePromises.push(this.fetchContent(f.id, `${path}${f.title}/`));
    }

    await Promise.all([...filePromises, ...recursivePromises]);
    return folder;
  };

  collectContent = async (elements: any[]) => {
    let parentId;
    if (elements[0].itemType == "file") {
      const file = await this.getFile(elements[0].id);
      parentId = file.folderId;
    } else {
      const folder = await this.getFolder(elements[0].id);
      parentId = folder.current.parentId;
    }

    const parent = await this.getFolder(parentId);

    const ids = {
      folders: [] as (number | string)[],
      files: [] as (number | string)[],
    };

    for (const e of elements) {
      if (e.itemType == "file") {
        ids.files.push(e.id);
      } else {
        ids.folders.push(e.id);
      }
    }

    return {
      parent,
      folders: parent.folders.filter((f: any) => ids.folders.includes(f.id)),
      files: parent.files.filter((f: any) => ids.files.includes(f.id)),
    };
  };

  getFile = async (id: File | any) => {
    if (!this.apiURL) this.createAPIUrl();

    let file = id;

    if (!id.fileExst) {
      file = (await (await fetch(`${this.apiURL}/files/file/${id}`)).json()).response;
    }

    return file;
  };

  getFolder = async (id?: number | string) => {
    if (!this.apiURL) this.createAPIUrl();

    return (await (await fetch(`${this.apiURL}/files/${id ? id : "rooms"}`)).json()).response;
  };

  getUser = async () => {
    if (!this.apiURL) this.createAPIUrl();

    const userRes = (await (await fetch(`${this.apiURL}/people/@self`)).json()).response;
    if (userRes.theme === "System") {
      userRes.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Base";
    }
    return userRes;
  };

  postMessage = (data: any) => {
    data.source = "archivesplugin";
    window.parent.postMessage(data, "*");
  };
}

export interface FileTreeItem {
  type: "file" | "folder";
  title: string;
  content: Uint8Array | FileTreeItem[];
}

function buildFileTree(flatStructure: fflate.Unzipped): FileTreeItem[] {
  const root: { [key: string]: any } = {};

  for (const [path, data] of Object.entries(flatStructure)) {
    const isDirectory = path.endsWith("/");
    const normalizedPath = path.replace(/^\/+|\/+$/g, "");
    const parts = normalizedPath ? normalizedPath.split("/") : [];

    let currentNode = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        if (isDirectory) {
          currentNode[part + "/"] = { type: "folder", content: [] };
        } else {
          currentNode[part] = { type: "file", content: data };
        }
      } else {
        if (!currentNode[part + "/"]) {
          currentNode[part + "/"] = { type: "folder", content: {} };
        }
        currentNode = currentNode[part + "/"].content;
      }
    }
  }

  return convertToFinalStructure(root);
}

function convertToFinalStructure(node: any): FileTreeItem[] {
  const result: FileTreeItem[] = [];

  for (const [title, item] of Object.entries<FileTreeItem>(node)) {
    if (item.type === "folder") {
      const children = convertToFinalStructure(item.content);
      result.push({
        type: "folder",
        title: title.replace("/", ""),
        content: children,
      });
    } else if (item.type === "file") {
      result.push({
        type: "file",
        title,
        content: item.content,
      });
    }
  }

  result.sort((a, b) => {
    if (a.type === b.type) {
      return a.title.localeCompare(b.title);
    }
    return a.type === "folder" ? -1 : 1;
  });

  return result;
}

const archives = new Archives();

export default archives;
