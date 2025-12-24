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

import { Actions, IMessage, IToast, ToastType } from "@onlyoffice/docspace-plugin-sdk";
import plugin from ".";
import * as fflate from "fflate";
import { modalDialogProps, frameProps, extractButton } from "./ModalDialog";
import { drawInIframe, loader, viewer, selector } from "./ModalDialog/Viewer";
import { selectorFrame, selectorProps, unzipButton } from "./ModalDialog/Selector";

class Archives {
  apiURL: string = "";
  root: FileTreeItem[] = [];
  archiveBuffer: fflate.Zippable = {};
  destinationFolderId: number | undefined = undefined;

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

  openZip = async (id: File | any) => {
    const file = await this.getFile(id);
    const user = await this.getUser();

    if (!file.security?.Download) {
      return {
        actions: [Actions.showToast],
        toastProps: [{ type: ToastType.error, title: "You don't have permission to view this file" } as IToast],
      };
    }

    fetch(`${this.apiURL}/files/file/${file.id}/recent`, {
      method: "POST",
      body: JSON.stringify({
        fileIds: [file.id],
      }),
    });

    this.getContent(file.viewUrl, () => {
      drawInIframe(frameProps.id!, viewer, this.root, file.title, user.theme === "Dark");
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

  openSelector = async (id: File | any, content?: FileTreeItem[], dark?: boolean) => {
    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: selectorProps,
    };

    if (!content) {
      const file = await this.getFile(id);
      const user = await this.getUser();

      if (!file.security?.Download) {
        return {
          actions: [Actions.showToast],
          toastProps: [{ type: ToastType.error, title: "You don't have permission to unzip this file" } as IToast],
        };
      }

      this.getContent(file.viewUrl, () => {
        drawInIframe(selectorFrame.id!, selector, null, [], this.root, false, user.theme === "Dark");
      });

      unzipButton.onClick = async () => {
        if (!this.destinationFolderId) return {};

        const msg = await this.unzip(
          this.destinationFolderId!,
          this.root,
          file.title.split(".").slice(0, -1).join(".")
        );
        msg.actions!.push(Actions.closeModal);

        return msg;
      };

      drawInIframe(selectorFrame.id!, loader);
    } else {
      // TODO: open with content and dark
    }

    return message;
  };

  unzip = async (targetFolder: File | number | any, fileContent?: FileTreeItem[], wrapperTitle?: string) => {
    if (!fileContent) {
      const file = await this.getFile(targetFolder);

      if (!file.security?.Download) {
        return {
          actions: [Actions.showToast],
          toastProps: [{ type: ToastType.error, title: "You don't have permission to unzip this file" } as IToast],
        } as IMessage;
      }

      targetFolder = file.folderId;
      wrapperTitle = file.title.split(".").slice(0, -1).join(".");
      fileContent = await this.getContent(file.viewUrl);
    }

    const problemFiles: string[] = [];

    const unzipRecursive = async (
      folderId: File | number | any,
      content?: FileTreeItem[],
      wrapperFolder?: string
    ): Promise<null> => {
      const promises: Promise<any>[] = [];

      const createFolder = async (f: FileTreeItem) => {
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

        return unzipRecursive(fId, f.content as FileTreeItem[]);
      };

      if (wrapperFolder) {
        return await createFolder({ type: "folder", title: wrapperFolder, content: content! });
      }

      for (const f of content!) {
        if (f.type === "file") {
          const blob = new Blob([f.content as Uint8Array]);
          const file = new File([blob], `blob`, {
            type: "",
            lastModified: new Date().getTime(),
          });

          const formData = new FormData();
          formData.append("file", file);

          const session = fetch(`${this.apiURL}/files/${folderId}/upload/create_session`, {
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
          })
            .then((res) => {
              return res.json();
            })
            .then((json) => {
              if (!json.response.data.location) {
                Promise.reject(`No location for file: ${f.title}`);
              }

              return fetch(`${json.response.data.location}`, {
                method: "POST",
                body: formData,
              });
            })
            .then((res) => {
              return res.json();
            })
            .then((json) => {
              if (!json.success) {
                console.error(`File upload error\nFilename: ${f.title}\nError message: ${json.message}`);
                problemFiles.push(f.title);
              }
            })
            .catch((err) => {
              console.error(err);
            });

          promises.push(session);
        } else {
          promises.push(createFolder(f));
        }
      }

      await Promise.all(promises);
      return null;
    };

    await unzipRecursive(targetFolder, fileContent, wrapperTitle);

    return {
      actions: [Actions.showToast],
      toastProps: [
        problemFiles.length > 0
          ? ({
              type: ToastType.error,
              title: `Some files were not unzipped: ${problemFiles.join(", ")}`,
            } as IToast)
          : ({
              type: ToastType.success,
              title: "File unziped successfully",
            } as IToast),
      ],
    } as IMessage;
  };

  zipFolder = async (id: number) => {
    if (!this.apiURL) this.createAPIUrl();

    const parent = await this.getFolder((await this.getFolder(id)).current.parentId);

    if (!parent.current.security.Create) {
      return {
        actions: [Actions.showToast],
        toastProps: [
          { type: ToastType.error, title: "Zip is not created. You can't create files in parent folder" } as IToast,
        ],
      };
    }

    this.archiveBuffer = {};
    const folder = await this.fetchContent(id);

    const zip = fflate.zipSync(this.archiveBuffer);

    const blob = new Blob([zip]);

    const file = new File([blob], `blob`, {
      type: "",
      lastModified: new Date().getTime(),
    });

    const formData = new FormData();
    formData.append("file", file);

    const sessionRes = await fetch(`${this.apiURL}/files/${parent.current.id}/upload/create_session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        createOn: new Date(),
        fileName: `${folder.current.title}.zip`,
        fileSize: file.size,
        relativePath: "",
        CreateNewIfExist: true,
      }),
    });

    if (!sessionRes.ok) {
      return {
        actions: [Actions.showToast],
        toastProps: [{ type: ToastType.error, title: "Failed to create zip" } as IToast],
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
      toastProps: [{ type: ToastType.success, title: "Zip is saved" } as IToast],
    };

    if (!data.success) {
      message.toastProps = [{ type: ToastType.error, title: "Failed to save zip" } as IToast];
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

  fetchContent = async (id: number, path: string = "") => {
    const folder = await this.getFolder(id);
    if (path !== "") {
      this.archiveBuffer[path] = new Uint8Array();
    }

    const filePromises = [];
    for (const file of folder.files) {
      filePromises.push(
        fetch(file.viewUrl)
          .then((data) => {
            if (data.status !== 200) {
              // TODO: error
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
