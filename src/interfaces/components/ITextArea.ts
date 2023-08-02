import { IMessage } from "../utils";

export interface ITextArea {
  value: string;
  onChange: (value: string) => IMessage | void;
  placeholder?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  hasError?: boolean;
  maxLength?: number;
  name?: string;
  tabIndex?: number;
  fontSize?: number;
  heightTextArea?: number;
  isJSONField?: boolean;
  enableCopy?: boolean;
  hasNumeration?: boolean;
  isFullHeight?: boolean;
  heightScale?: boolean;
  copyInfoText?: boolean;
}
