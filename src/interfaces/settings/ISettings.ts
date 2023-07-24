import { SettingsType } from "../../enums/Settings";
import { IBox, IButton } from "../components";
import { IControlGroup } from "./IControlGroup";

export interface ISettings {
  type: SettingsType;
  withCustomSettings?: boolean;
  customSettings?: IBox;
  groups?: IControlGroup[];
  withAcceptButton?: boolean;
  acceptButtonProps?: IButton;
  cancelButtonProps?: IButton;
  isLoading?: boolean;
  onLoad?: () => Promise<boolean>;
}
