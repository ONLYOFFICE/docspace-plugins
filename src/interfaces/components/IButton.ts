import { IMessage } from "../utils";

export const enum ButtonSize {
  extraSmall = "extra-small",
  small = "small",
  normal = "normal",
  medium = "medium",
}

export interface IButton {
  label?: string;
  primary?: boolean;
  size?: ButtonSize;
  scale?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: () => Promise<void> | Promise<IMessage> | IMessage | void;
}
