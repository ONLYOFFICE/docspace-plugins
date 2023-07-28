import { IMessage } from "../utils";

export interface IComboBoxItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface IComboBox {
  scaled?: boolean;
  directionX?: "left" | "right";
  directionY?: "bottom" | "top" | "both";
  displayType?: "default" | "toggle";
  dropDownMaxHeight?: number;
  showDisabledItems?: boolean;
  withBackdrop?: boolean;
  isDisabled?: boolean;
  noBorder?: boolean;
  onSelect?: (item: IComboBoxItem) => IMessage | void;
  opened?: boolean;
  options: IComboBoxItem[];
  scaledOptions?: boolean;
  selectedOption: IComboBoxItem;
  onToggle?: () => IMessage | void;
  modernView?: boolean;
}
