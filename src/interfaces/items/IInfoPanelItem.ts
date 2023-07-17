import { FilesExst, FilesType } from "../../enums/Files";
import { IBox } from "../components";
import { IMessage } from "../utils";

export interface InfoPanelSubMenu {
  name: string;
  onClick?: () => Promise<IMessage> | IMessage | void;
}

export interface IInfoPanelItem {
  key: string;
  filesType?: FilesType[];
  filesExsts?: FilesExst[];
  subMenu: InfoPanelSubMenu;
  body: IBox;
}
