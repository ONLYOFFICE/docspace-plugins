const IPlugin = "IPlugin";
const IApiPlugin = "IApiPlugin";
const ISettingsPlugin = "ISettingsPlugin";
const IContextMenuPlugin = "IContextMenuPlugin";

const ISettings = "ISettings";
const IControlGroup = "IControlGroup";
const SettingsType = "SettingsType";
const ControlGroupElement = "ControlGroupElement";

const IContextMenuItem = "IContextMenuItem";
const ContextMenuItemType = "ContextMenuItemType";
const ISeparatorItem = "ISeparatorItem";

const IInput = "IInput";
const InputSize = "InputSize";
const InputType = "InputType";
const InputAutocomplete = "InputAutocomplete";
const ICheckbox = "ICheckbox";
const IToggleButton = "IToggleButton";
const IToast = "IToast";
const ToastType = "ToastType";
const IButton = "IButton";
const ButtonSize = "ButtonSize";

const IMessage = "IMessage";

const Actions = "Actions";
const Events = "Events";
const PluginItems = "PluginItems";
const PluginStatus = "PluginStatus";
const FilesExst = "FilesExst";

const status = `status: PluginStatus = PluginStatus.active;`;

const userPluginSettings = `userPluginSettings: ISettings | null = {} as ISettings;`;
const adminPluginSettings = `adminPluginSettings: ISettings | null = {} as ISettings;`;

const origin = `origin = "";`;
const proxy = `proxy = "";`;
const prefix = `prefix = "";`;

const contextMenuItems = `
  contextMenuItems: Map<string, IContextMenuItem | ISeparatorItem> = new Map();`;

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

const getUserPluginSettings = `
  getUserPluginSettings = () => {
    return this.userPluginSettings;
  };`;

const setUserPluginSettings = `
  setUserPluginSettings = (settings: ISettings | null): void => {
    this.userPluginSettings = settings;
  };`;

const getAdminPluginSettings = `  
  getAdminPluginSettings = () => {
    return this.adminPluginSettings;
  };`;

const setAdminPluginSettings = `
  setAdminPluginSettings = (settings: ISettings | null): void => {
    this.adminPluginSettings = settings;
  };`;

const setOrigin = `
  setOrigin = (origin: string): void => {
    this.origin = origin;
  };`;

const getOrigin = `
  getOrigin = (): string => {
    return this.origin;
  };`;

const setProxy = `
  setProxy = (proxy: string): void => {
    this.proxy = proxy;
  };`;

const getProxy = `
  getProxy = (): string => {
    return this.proxy;
  };`;

const setPrefix = `
  setPrefix = (prefix: string): void => {
    this.prefix = prefix;
  };`;

const getPrefix = `
  getPrefix = (): string => {
    return this.prefix;
  };`;

const setAPI = `
  setAPI = (origin: string, proxy: string, prefix: string): void => {
    this.origin = origin;
    this.proxy = proxy;
    this.prefix = prefix;
  };`;

const getAPI = `
  getAPI = (): { origin: string; proxy: string; prefix: string } => {
    return { origin: this.origin, proxy: this.proxy, prefix: this.prefix };
  };`;

const addContextMenuItem = `
  addContextMenuItem = (item: IContextMenuItem | ISeparatorItem): void => {
    this.contextMenuItems.set(item.key, item);
  };`;

const getContextMenuItemsKeys = `
  getContextMenuItemsKeys = (): string[] => {
    const keys = Array.from(this.contextMenuItems).map(([key, item]) => key);

    return keys;
  };`;

const getContextMenuItems = `
  getContextMenuItems = (): Map<string, IContextMenuItem | ISeparatorItem> => {
    return this.contextMenuItems;
  };`;

const updateContextMenuItem = `
  updateContextMenuItem = (item: IContextMenuItem | ISeparatorItem): void => {
    this.contextMenuItems.set(item.key, item);
  };`;

export {
  IPlugin,
  IApiPlugin,
  ISettingsPlugin,
  IContextMenuPlugin,
  IContextMenuItem,
  ContextMenuItemType,
  ISeparatorItem,
  ISettings,
  SettingsType,
  IControlGroup,
  ControlGroupElement,
  IInput,
  InputSize,
  InputType,
  InputAutocomplete,
  ICheckbox,
  IToggleButton,
  IToast,
  ToastType,
  IButton,
  ButtonSize,
  Events,
  PluginItems,
  PluginStatus,
  Actions,
  FilesExst,
  IMessage,
  status,
  userPluginSettings,
  adminPluginSettings,
  origin,
  proxy,
  prefix,
  contextMenuItems,
  onLoadCallback,
  updateStatus,
  getStatus,
  setOnLoadCallback,
  getUserPluginSettings,
  setUserPluginSettings,
  getAdminPluginSettings,
  setAdminPluginSettings,
  setOrigin,
  getOrigin,
  setProxy,
  getProxy,
  setPrefix,
  getPrefix,
  setAPI,
  getAPI,
  addContextMenuItem,
  getContextMenuItemsKeys,
  getContextMenuItems,
  updateContextMenuItem,
};
