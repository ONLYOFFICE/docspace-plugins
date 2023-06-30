import { ISettings } from "../settings/ISettings";

export interface ISettingsPlugin {
  getPluginSettings(): ISettings;
}
