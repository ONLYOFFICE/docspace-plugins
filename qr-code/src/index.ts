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
  IInfoPanelItem,
  IInfoPanelPlugin,
  IMessage,
  IPlugin,
  ModalDisplayType,
  PluginLocale,
  PluginStatus,
  Security,
} from "@onlyoffice/docspace-plugin-sdk";

import { currentLocale, setLocale, t } from "./locales";
import { setTarget } from "./target";
import { QrCodeModal } from "./QrCodeModal";
import { QrInfoPanelTab } from "./QrInfoPanelTab";

class QrCode
  implements
    IPlugin,
    IContextMenuPlugin,
    IInfoPanelPlugin
{
  status: PluginStatus = PluginStatus.active;

  contextMenuItems: Map<string, IContextMenuItem> = new Map();

  infoPanelItems: Map<string, IInfoPanelItem> = new Map();

  // Register items here rather than at module scope. Both are read in time, but
  // setLanguage and setAPI only run after the bundle executes - so a factory that
  // translates a label or calls getAPI() at module scope would capture empty values.
  //
  // Anything with a visible surface is a React component (a .tsx file under src/,
  // built from @docspace/ui-kit) handed over as the item's `component`. Icons are
  // referenced by file name and resolved against assets/. Labels should come from
  // t() in ./locales, which means adding the key to TStrings first.
  onLoadCallback = async (): Promise<void> => {
    const openQrModal = (): IMessage => ({
      actions: [Actions.showModal],
      modalDialogProps: {
        displayType: ModalDisplayType.modal,
        dialogHeader: t("modal.header"),
        dialogBodyComponent: QrCodeModal,
        autoMaxWidth: true,
        autoMaxHeight: true,
      },
    });

    this.addContextMenuItem({
      key: "qr-code_file",
      label: t("contextMenu.label"),
      icon: "icon-16.svg",
      fileType: [FilesType.file, FilesType.image, FilesType.video],
      itemSecurity: [FilesSecurity.CopyLink],
      onItemClick: (id) => {
        setTarget({ id, kind: "file" });
        return openQrModal();
      },
    });

    this.addContextMenuItem({
      key: "qr-code_folder",
      label: t("contextMenu.label"),
      icon: "icon-16.svg",
      fileType: [FilesType.folder, FilesType.room],
      itemSecurity: [Security.CopyLink],
      onItemClick: (id) => {
        setTarget({ id, kind: "folder" });
        return openQrModal();
      },
    });

    this.addInfoPanelItem({
      key: "qr-code",
      subMenu: { name: t("infoPanel.tabName") },
      component: QrInfoPanelTab,
    });
  };

  updateStatus = (status: PluginStatus): void => {
    this.status = status;
  };

  getStatus = (): PluginStatus => this.status;

  setOnLoadCallback = (callback: () => Promise<void>): void => {
    this.onLoadCallback = callback;
  };

  // Called once, immediately before onLoadCallback - not again when the language
  // changes (that reloads the whole plugin as a fresh module, so the factories run
  // again on their own). Recording the locale is the whole job: the item factories
  // below it are what translate the labels.
  setLanguage = (language: PluginLocale): void => {
    setLocale(language);
  };

  getLanguage = (): PluginLocale => currentLocale();

  addContextMenuItem = (item: IContextMenuItem): void => {
    this.contextMenuItems.set(item.key, item);
  };

  getContextMenuItems = (): Map<string, IContextMenuItem> => this.contextMenuItems;

  getContextMenuItemsKeys = (): string[] => Array.from(this.contextMenuItems.keys());

  updateContextMenuItem = (item: IContextMenuItem): void => {
    this.contextMenuItems.set(item.key, item);
  };

  addInfoPanelItem = (item: IInfoPanelItem): void => {
    this.infoPanelItems.set(item.key, item);
  };

  getInfoPanelItems = (): Map<string, IInfoPanelItem> => this.infoPanelItems;

  updateInfoPanelItem = (item: IInfoPanelItem): void => {
    this.infoPanelItems.set(item.key, item);
  };
}

const plugin = new QrCode();

export default plugin;
