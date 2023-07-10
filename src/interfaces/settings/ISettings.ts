import { IButton } from "../components";
import { IControlGroup } from "./IControlGroup";

export const enum SettingsType {
  modal = "modal",
  settingsPage = "settings-page",
  both = "both",
}

export interface ISettings {
  type: SettingsType;
  groups: IControlGroup[];
  withAcceptButton: boolean;
  acceptButton?: IButton;
  isLoading?: boolean;
  onLoad?: () => Promise<boolean>;
}
