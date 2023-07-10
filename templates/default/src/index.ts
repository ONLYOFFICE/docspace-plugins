import { IPlugin, PluginStatus } from "onlyoffice-docspace-plugin";

// class name can be anything
// for connect more plugin type - add suitable interface at implements block
class ChangedName implements IPlugin {
  // current plugin status
  // active - the user can use the options for this plugin
  // pending - the user can see the options for this plugin, but it needs to be configured to use
  // hide - the user can not see the options for this plugin, needs to be configured to use
  status: PluginStatus = PluginStatus.active;

  // method for update plugin status
  updateStatus = (status: PluginStatus) => {
    this.status = status;
  };
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
