import { Devices, UsersType } from "../../enums";
import { FilesExst, FilesType } from "../../enums/Files";
import { IBox } from "../components";
import { IMessage } from "../utils";

export interface IInfoPanelSubMenu {
  name: string;
  onClick?: (id: number) => Promise<IMessage> | IMessage | void;
}

export interface IInfoPanelItem {
  key: string;
  subMenu: IInfoPanelSubMenu;
  body: IBox;
  onLoad: () => Promise<{ body: IBox }>;
  filesType?: FilesType[];
  filesExsts?: (FilesExst | string)[];
  usersTypes?: UsersType[];
  devices?: Devices[];
}
