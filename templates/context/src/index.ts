import {
  IPlugin,
  IContextMenuPlugin,
  IContextMenuItem,
  ISeparatorItem,
  PluginStatus,
} from "onlyoffice-docspace-plugin";

// class name can be anything
// for connect more plugin type - add suitable interface at implements block
class ChangedName implements IPlugin, IContextMenuPlugin {
  // current plugin status
  // active - the user can use the options for this plugin
  // pending - the user can see the options for this plugin, but it needs to be configured to use
  // hide - the user can not see the options for this plugin, needs to be configured to use
  status: PluginStatus = PluginStatus.active;

  // method for update plugin status
  updateStatus = (status: PluginStatus) => {
    this.status = status;
  };

  // this collection contains all the elements for the context menu
  contextMenuItems: Map<string, IContextMenuItem | ISeparatorItem> = new Map<
    string,
    IContextMenuItem | ISeparatorItem
  >();

  // method set to context menu items new item
  addContextMenuItem(item: IContextMenuItem | ISeparatorItem): void {
    this.contextMenuItems.set(item.key, item);
  }

  // get context menu items needed for activation
  activateContextMenuItems(): Map<string, IContextMenuItem | ISeparatorItem> {
    return this.contextMenuItems;
  }

  // get keys of context menu items needed for deactivation
  deactivateContextMenuItems(): string[] {
    const contextMenuItemsKeys: string[] = [];

    Array.from(this.contextMenuItems, ([key, value]) =>
      contextMenuItemsKeys.push(key)
    );

    return contextMenuItemsKeys;
  }
}

// create instance of the plugin
// instance name can be anything
// the main thing is to pass it to window.Plugins
const pluginInstance = new ChangedName();

//!!!don't touch it!!!
declare global {
  interface Window {
    Plugins: any;
  }
}

// if you want to change name of plugin at window.Plugins
// you should change output file name at webpack.config.js to same name
window.Plugins.ChangedName = pluginInstance || {};
