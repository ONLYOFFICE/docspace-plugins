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
  File,
  FilesSecurity,
  IFileItem,
  IFilePlugin,
  IMessage,
  IPlugin,
  PluginLocale,
  PluginStatus,
} from "@onlyoffice/docspace-plugin-sdk";

import { EmailPreview } from "./EmailPreview";
import { SUPPORTED_EXTENSIONS } from "./email/types";
import { currentLocale, setLocale, t } from "./locales";

class EmailViewer implements IPlugin, IFilePlugin {
  status: PluginStatus = PluginStatus.active;

  fileItems: Map<string, IFileItem> = new Map();

  // Register items here rather than at module scope: setLanguage runs only after the
  // bundle executes, so a label translated at module scope would capture English.
  onLoadCallback = async (): Promise<void> => {
    const openInViewer = (file: File): IMessage => ({
      actions: [Actions.showMediaViewer],
      mediaViewerProps: {
        fileId: file.id,
        title: file.title,
        component: EmailPreview,
        // Page only through other messages in the folder, not the images beside them.
        playlistFilter: {
          filesExsts: [...SUPPORTED_EXTENSIONS],
          filesSecurity: [FilesSecurity.Read],
        },
        onClose: () => ({ actions: [Actions.closeMediaViewer] }),
      },
    });

    for (const extension of SUPPORTED_EXTENSIONS) {
      this.addFileItem({
        extension,
        fileTypeName: t("file.typeName"),
        fileRowIcon: "email-row.svg",
        fileTileIcon: "email-tile.svg",
        onClick: openInViewer,
      });
    }
  };

  updateStatus = (status: PluginStatus): void => {
    this.status = status;
  };

  getStatus = (): PluginStatus => this.status;

  setOnLoadCallback = (callback: () => Promise<void>): void => {
    this.onLoadCallback = callback;
  };

  setLanguage = (language: PluginLocale): void => {
    setLocale(language);
  };

  getLanguage = (): PluginLocale => currentLocale();

  addFileItem = (item: IFileItem): void => {
    this.fileItems.set(item.extension, item);
  };

  getFileItems = (): Map<string, IFileItem> => this.fileItems;

  updateFileItem = (item: IFileItem): void => {
    this.fileItems.set(item.extension, item);
  };
}

const plugin = new EmailViewer();

export default plugin;
