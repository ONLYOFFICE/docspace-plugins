import { UsersType } from "../../enums";
import { IMessage } from "../utils";

export interface IMainButtonItem {
  key: string;
  position: number;
  label: string;
  icon: string;
  onClick?: (id: number) => Promise<IMessage> | IMessage | void;
  usersType?: UsersType[];
  items?: IMainButtonItem[];
}
