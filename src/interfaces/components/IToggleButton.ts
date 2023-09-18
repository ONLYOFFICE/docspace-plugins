import { IMessage } from "../utils";

export interface IToggleButton {
  label?: string;
  isChecked: boolean;
  onChange: () => IMessage | void;
  isDisabled?: boolean;
  style?: any;
}
