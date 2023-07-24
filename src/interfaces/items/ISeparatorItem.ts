import { FilesExst, FilesType, UsersType } from "../../enums";

export interface ISeparatorItem {
  key: string;
  position: number;
  isSeparator: boolean;
  FilesExst?: FilesExst[];
  FilesType?: FilesType[];
  userTypes?: UsersType[];
}
