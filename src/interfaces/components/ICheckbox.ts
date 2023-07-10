import { IMessage } from "../utils";

export interface ICheckbox {
  label?: string;
  isChecked?: boolean;
  truncate?: boolean;
  tabIndex?: number;
  hasError?: boolean;
  name?: string;
  value?: string;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  onChange?: () => IMessage | void;
  title?: string;
}
