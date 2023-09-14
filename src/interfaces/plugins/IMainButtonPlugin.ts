import { IMainButtonItem } from "../items";

export interface IMainButtonPlugin {
  mainButtonItems: Map<string, IMainButtonItem>;

  addMainButtonItem(item: IMainButtonItem): void;

  getMainButtonItems(): Map<string, IMainButtonItem>;

  updateMainButtonItem(item: IMainButtonItem): void;
}
