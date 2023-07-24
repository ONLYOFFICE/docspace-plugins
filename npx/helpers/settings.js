const ISettingsPlugin = "ISettingsPlugin";
const ISettings = "ISettings";

const userPluginSettings = `userPluginSettings: ISettings | null = {} as ISettings;`;
const adminPluginSettings = `adminPluginSettings: ISettings | null = {} as ISettings;`;

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

export const getSettingsTemp = (withSettings) => {
  if (!withSettings)
    return { settingsVars: "", settingsMeth: "", ISettingsPlugin, ISettings };
  let settingsVars = ``;
  let settingsMeth = ``;

  settingsVars = `
  ${userPluginSettings}
  ${adminPluginSettings}`;

  settingsMeth = `
          ${getUserPluginSettings}
          ${setUserPluginSettings}
          ${getAdminPluginSettings}
          ${setAdminPluginSettings}`;

  return { settingsVars, settingsMeth, ISettingsPlugin, ISettings };
};
