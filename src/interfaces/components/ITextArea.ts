import { IMessage } from "../utils";

export interface ITextArea {
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  hasError?: boolean;
  maxLength?: number;
  name?: string;
  tabIndex?: number;
  fontSize?: number;
  heightTextArea?: number;
  value: string;
  isJSONField?: boolean;
  enableCopy?: boolean;
  hasNumeration?: boolean;
  isFullHeight?: boolean;
  heightScale?: boolean;
  onChange: (value: string) => IMessage | void;
  copyInfoText?: boolean;
}
