import { IMessage } from "../utils";

export interface ICheckbox {
  isChecked: boolean;
  onChange: () => IMessage | void;
  label?: string;
  truncate?: boolean;
  tabIndex?: number;
  hasError?: boolean;
  name?: string;
  value?: string;
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  title?: string;
}
