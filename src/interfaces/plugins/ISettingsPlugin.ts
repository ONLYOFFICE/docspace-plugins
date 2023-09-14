import { ISettings } from "../settings/ISettings";

export interface ISettingsPlugin {
  // userPluginSettings: ISettings | null;

  adminPluginSettings: ISettings | null;

  // setUserPluginSettings(settings: ISettings | null): void;

  // getUserPluginSettings(): ISettings | null;

  setAdminPluginSettings(settings: ISettings | null): void;

  getAdminPluginSettings(): ISettings | null;
}
