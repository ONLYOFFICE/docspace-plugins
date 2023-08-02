import { IMessage } from "../utils";

export const enum ButtonSize {
  extraSmall = "extra-small",
  small = "small",
  normal = "normal",
  medium = "medium",
}

export interface IButton {
  label: string;
  size: ButtonSize;
  onClick: () => Promise<IMessage> | IMessage | void;
  primary?: boolean;
  scale?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  withLoadingAfterClick?: boolean;
}
