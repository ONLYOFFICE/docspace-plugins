import { ISettings } from "../settings/ISettings";

export interface ISettingsPlugin {
  pluginSettings: ISettings;

  setPluginSettings(settings: ISettings): void;

  getPluginSettings(): ISettings;
}
