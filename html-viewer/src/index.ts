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
  FilesSecurity,
  FilesType,
  IContextMenuItem,
  IContextMenuPlugin,
  IFileItem,
  IFilePlugin,
  IMessage,
  IPlugin,
  PluginLocale,
  PluginStatus,
} from "@onlyoffice/docspace-plugin-sdk";

import { canClose } from "./edits";
import { HtmlPreview } from "./HtmlPreview";
import { currentLocale, setLocale, t } from "./locales";

const EXTENSIONS = [".html", ".htm"];

class HtmlViewer implements IPlugin, IFilePlugin, IContextMenuPlugin {
  status: PluginStatus = PluginStatus.active;

  fileItems: Map<string, IFileItem> = new Map();

  contextMenuItems: Map<string, IContextMenuItem> = new Map();

  // Register items here rather than at module scope: setLanguage runs only after the
  // bundle executes, so a label translated at module scope would capture English.
  onLoadCallback = async (): Promise<void> => {
    // No `title`: it would replace the file name in the viewer's header for every file
    // the user pages to.
    const openInViewer = (fileId: number | string): IMessage => ({
      actions: [Actions.showMediaViewer],
      mediaViewerProps: {
        fileId,
        component: HtmlPreview,
        // Page only through other HTML files in the folder.
        playlistFilter: {
          filesExsts: EXTENSIONS,
          filesSecurity: [FilesSecurity.Read],
        },
        // Returning nothing keeps the viewer open: an unsaved edit is not lost to a click
        // on the cross, Escape or Back, and the component says why it stayed.
        onClose: () => (canClose() ? { actions: [Actions.closeMediaViewer] } : undefined),
      },
    });

    for (const extension of EXTENSIONS) {
      this.addFileItem({
        extension,
        fileTypeName: t("file.typeName"),
        fileRowIcon: "html-row.svg",
        fileTileIcon: "html-tile.svg",
        onClick: (file) => openInViewer(file.id),
      });
    }

    // Codemirror claims .html and .htm as well, and of two plugins on one extension the
    // one loaded last gets the click. This item reaches the viewer whichever that is.
    this.addContextMenuItem({
      key: "html-viewer-preview",
      label: t("menu.preview"),
      icon: "preview-16.svg",
      fileType: [FilesType.file],
      fileExt: EXTENSIONS,
      onItemClick: (id) => openInViewer(id),
    });
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

  addContextMenuItem = (item: IContextMenuItem): void => {
    this.contextMenuItems.set(item.key, item);
  };

  getContextMenuItems = (): Map<string, IContextMenuItem> => this.contextMenuItems;

  getContextMenuItemsKeys = (): string[] => Array.from(this.contextMenuItems.keys());

  updateContextMenuItem = (item: IContextMenuItem): void => {
    this.contextMenuItems.set(item.key, item);
  };
}

const plugin = new HtmlViewer();

export default plugin;
