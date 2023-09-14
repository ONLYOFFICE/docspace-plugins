import { Devices, UsersType } from "../../enums";
import { IMessage } from "../utils";

export interface IMainButtonItem {
  key: string;
  label: string;
  icon: string;
  onClick?: (id: number) => Promise<IMessage> | IMessage | void;
  usersType?: UsersType[];
  items?: IMainButtonItem[];
  devices?: Devices[];
}
