import {
	IPlugin,
	PluginStatus,
	PluginLocale,
	IContextMenuPlugin,
	IContextMenuItem,
	IFilePlugin,
	IFileItem
} from "@onlyoffice/docspace-plugin-sdk";

import { contextMenuItem } from "./ContextMenu";
import { readerFileItems } from "./File";
import { i18n, setLocale } from "./locales";

class BookReader implements IPlugin, IContextMenuPlugin, IFilePlugin {
	status: PluginStatus = PluginStatus.active;
	contextMenuItems: Map<string, IContextMenuItem> = new Map();
	fileItems: Map<string, IFileItem> = new Map();

	setLanguage = (language: PluginLocale) => {
		setLocale(language);
	};

	getLanguage = () => {
		return i18n.locale as PluginLocale;
	};

	onLoadCallback = async () => {};

	updateStatus = (status: PluginStatus) => {
		this.status = status;
	};

	getStatus = () => {
		return this.status;
	};

	setOnLoadCallback = (callback: () => Promise<void>) => {
		this.onLoadCallback = callback;
	};

	addContextMenuItem = (item: IContextMenuItem): void => {
		this.contextMenuItems.set(item.key, item);
	};

	getContextMenuItems = (): Map<string, IContextMenuItem> => {
		return this.contextMenuItems;
	};

	getContextMenuItemsKeys = (): string[] => {
		const keys = Array.from(this.contextMenuItems).map(([key]) => key);
		return keys;
	};

	updateContextMenuItem = (item: IContextMenuItem): void => {
		this.contextMenuItems.set(item.key, item);
	};

	getFileItems = (): Map<string, IFileItem> => {
		return this.fileItems;
	};

	addFileItem = (item: IFileItem): void => {
		this.fileItems.set(item.extension, item);
	};

	updateFileItem = (item: IFileItem): void => {
		this.fileItems.set(item.extension, item);
	};
}

const plugin = new BookReader();

declare global {
	interface Window {
		Plugins: any;
	}
}

plugin.addContextMenuItem(contextMenuItem);

for (const item of readerFileItems) {
	plugin.addFileItem(item);
}

window.Plugins.BookReader = plugin || {};

export default plugin;
