import { FilesExst, FilesType, UsersType } from "../../enums";
import { IMessage } from "../utils";

export interface IContextMenuItem {
  key: string;
  position: number;
  label: string;
  icon: string;
  onClick: (id: number) => Promise<IMessage> | IMessage | void;
  fileExt?: FilesExst[];
  fileType?: FilesType[];
  usersTypes?: UsersType[];
}
