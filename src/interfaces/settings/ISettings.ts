import { SettingsType } from "../../enums/Settings";
import { IBox } from "../components";

export interface ISettings {
  type: SettingsType;
  customSettings: IBox;
  isLoading?: boolean;
  onLoad?: () => Promise<{ customSettings: IBox }>;
}
