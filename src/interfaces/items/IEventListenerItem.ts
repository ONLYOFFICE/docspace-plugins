import { Events, UsersType } from "../../enums";
import { IMessage } from "../utils";

export interface IEventListenerItem {
  key: string;
  eventType: Events;
  eventHandler: () => Promise<IMessage> | IMessage | void;
  usersTypes?: UsersType[];
}
