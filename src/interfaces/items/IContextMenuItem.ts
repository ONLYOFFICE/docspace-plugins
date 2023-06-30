export const enum ContextMenuItemType {
  Files = "Files",
  Folders = "Folders",
  Rooms = "Rooms",
  All = "All",
}

export interface IContextMenuItem {
  key: string;
  type: ContextMenuItemType;
  position: number;
  label: string;
  icon: string;
  onClick: (item: any | null) => void;
}
