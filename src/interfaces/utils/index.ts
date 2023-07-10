import { Actions } from "../../enums";
import {
  IButton,
  ICheckbox,
  IInput,
  IToast,
  IToggleButton,
} from "../components";

export interface IMessage {
  newProps?: IInput | ICheckbox[] | IToggleButton[] | IButton;
  actions?: Actions[];
  toastProps?: IToast;
  acceptButtonProps?: IButton;
}
