import { UsersType } from "../../enums";

export interface IMainButtonItem {
  key: string;
  position: number;
  label: string;
  icon: string;
  onClick: () => void;
  usersType?: UsersType[];
}
