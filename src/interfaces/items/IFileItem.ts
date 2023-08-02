import { UsersType } from "../../enums";
import { IMessage } from "../utils";

export interface File {
  folderId: number;
  fileExst: string;
  id: number;
  rootFolderType: number;
  rootFolderId: number;
  title: string;
  viewUrl: string;
  webUrl: string;
}

export interface IFileItem {
  extension: string;
  onClick: (item: File) => Promise<IMessage> | IMessage | void;
  usersType?: UsersType[];
}
