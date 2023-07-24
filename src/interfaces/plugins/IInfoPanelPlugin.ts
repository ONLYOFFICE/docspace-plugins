import { IInfoPanelItem } from "../items";

export interface IInfoPanelPlugin {
  infoPanelItems: Map<string, IInfoPanelItem>;

  addInfoPanelItem(item: IInfoPanelItem): void;

  getInfoPanelItems(): Map<string, IInfoPanelItem>;

  updateInfoPanelItem(item: IInfoPanelItem): void;
}
