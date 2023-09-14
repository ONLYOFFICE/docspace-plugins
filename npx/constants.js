const IPlugin = "IPlugin";

// const ISeparatorItem = "ISeparatorItem";

const PluginStatus = `PluginStatus`;
const status = `status: PluginStatus = PluginStatus.active;`;

const onLoadCallback = `
  onLoadCallback = async () => {};`;

const updateStatus = ` 
  updateStatus = (status: PluginStatus) => {
    this.status = status;
  };`;

const getStatus = `
  getStatus = () => {
    return this.status;
  };`;

const setOnLoadCallback = `
  setOnLoadCallback = (callback: () => Promise<void>) => {
    this.onLoadCallback = callback;
  };`;

export {
  IPlugin,
  PluginStatus,
  // ISeparatorItem,
  status,
  onLoadCallback,
  updateStatus,
  getStatus,
  setOnLoadCallback,
};
