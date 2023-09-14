import { Devices, FilesExst, FilesType, UsersType } from "../../enums";

export interface ISeparatorItem {
  key: string;
  isSeparator: true;
  FilesExst?: FilesExst[];
  FilesType?: FilesType[];
  userTypes?: UsersType[];
  devices?: Devices[];
}
