import { Devices, UsersType } from "../../enums";
import { IMessage } from "../utils";

export interface IProfileMenuItem {
  key: string;
  label: string;
  icon: string;
  onClick: () => Promise<IMessage> | IMessage | void;
  usersType?: UsersType[];
  devices?: Devices[];
}
