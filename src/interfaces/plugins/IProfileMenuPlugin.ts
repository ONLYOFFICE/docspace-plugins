import { IProfileMenuItem } from "../items";

export interface IProfileMenuPlugin {
  profileMenuItems: Map<string, IProfileMenuItem>;

  addProfileMenuItem(item: IProfileMenuItem): void;

  getProfileMenuItems(): Map<string, IProfileMenuItem>;

  updateProfileMenuItem(item: IProfileMenuItem): void;
}
