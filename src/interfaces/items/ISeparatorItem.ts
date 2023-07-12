import { UsersType } from "../../enums";
import { ContextMenuItemType } from "./IContextMenuItem";

export interface ISeparatorItem {
  key: string;
  position: number;
  isSeparator: boolean;
  type?: ContextMenuItemType;
  userTypes?: UsersType[];
}
