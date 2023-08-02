import { UsersType } from "../../enums";
import { IMessage } from "../utils";

export interface IProfileMenuItem {
  key: string;
  position: number;
  label: string;
  icon: string;
  onClick: () => Promise<IMessage> | IMessage | void;
  usersType?: UsersType[];
}
