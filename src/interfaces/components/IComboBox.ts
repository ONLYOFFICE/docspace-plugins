import { IMessage } from "../utils";

export interface IComboBoxItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

export interface IComboBox {
  options: IComboBoxItem[];
  selectedOption: IComboBoxItem;
  onSelect?: (item: IComboBoxItem) => IMessage | void;
  scaled?: boolean;
  directionX?: "left" | "right";
  directionY?: "bottom" | "top" | "both";
  displayType?: "default" | "toggle";
  dropDownMaxHeight?: number;
  showDisabledItems?: boolean;
  withBackdrop?: boolean;
  isDisabled?: boolean;
  noBorder?: boolean;
  opened?: boolean;
  scaledOptions?: boolean;
  onToggle?: () => IMessage | void;
  modernView?: boolean;
}
