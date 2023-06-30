import { Actions } from "../../enums/Actions";

export const enum InputSize {
  base = "base",
  middle = "middle",
  big = "big",
  huge = "huge",
  large = "large",
}

export const enum InputAutocomplete {
  on = "on",
  off = "off",
}

export const enum InputType {
  text = "text",
  password = "password",
}

export interface IInput {
  name?: string;
  placeholder?: string;
  maxLength?: string;
  size?: InputSize;
  isAutoFocused?: boolean;
  isReadOnly?: boolean;
  hasError?: boolean;
  hasWarning?: boolean;
  scale?: boolean;
  autoComplete?: InputAutocomplete;
  tabIndex?: number;
  mask?: [];
  isDisabled?: boolean;
  type?: InputType;
  keepCharPositions?: boolean;
  onChange?: (e: { target: { value: string } }) => {
    newProps?: IInput;
    actions?: Actions;
    toastProps?: [];
  } | void;
  onBlur?: () => void;
  onFocus?: () => void;
  value?: string;
  children?: Node[] | Node;
  iconSize?: number;
  iconName?: string;
  isIconFill?: boolean;
  iconColor?: string;
  hoverColor?: string;
  iconButtonClassName?: string;
  onIconClick?: () => void;
}
