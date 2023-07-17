import { IContextMenuItem, ISeparatorItem } from "../items";

export interface IContextMenuPlugin {
  contextMenuItems: Map<string, IContextMenuItem | ISeparatorItem>;

  addContextMenuItem(item: IContextMenuItem | ISeparatorItem): void;

  getContextMenuItems(): Map<string, IContextMenuItem | ISeparatorItem>;

  getContextMenuItemsKeys(): string[];

  updateContextMenuItem(item: IContextMenuItem | ISeparatorItem): void;
}
