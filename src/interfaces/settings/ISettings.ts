import { ButtonGroup, IBox } from "../components";

export interface ISettings {
  settings: IBox;
  saveButton: ButtonGroup;

  isLoading?: boolean;
  onLoad?: () => Promise<{ settings: IBox }>;
}
