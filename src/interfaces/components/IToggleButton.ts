import { IMessage } from "../utils";

export interface IToggleButton {
  isDisabled?: boolean;
  label?: string;
  isChecked: boolean;
  onChange?: () => IMessage | void;
}
