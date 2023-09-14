import { IContextMenuItem } from "../items";

export interface IContextMenuPlugin {
  contextMenuItems: Map<string, IContextMenuItem>;

  addContextMenuItem(item: IContextMenuItem): void;

  getContextMenuItems(): Map<string, IContextMenuItem>;

  getContextMenuItemsKeys(): string[];

  updateContextMenuItem(item: IContextMenuItem): void;
}
