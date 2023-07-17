import { FilesExst, UsersType } from "../../enums";
import { IMessage } from "../utils";

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
  onClick: (id: number) => Promise<IMessage> | Promise<void> | IMessage | void;
  fileExt?: FilesExst[] | "all";
  usersTypes?: UsersType[];
}
