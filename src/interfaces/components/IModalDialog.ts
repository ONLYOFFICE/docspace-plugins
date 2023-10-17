import { IMessage } from "../utils";
import { IBox } from "./IBox";

export const enum ModalDisplayType {
  modal = "modal",
  aside = "aside",
}

export interface IModalDialog {
  displayType: ModalDisplayType;
  dialogHeader?: string;
  dialogBody: IBox;
  dialogFooter?: IBox;
  autoMaxWidth?: boolean;
  autoMaxHeight?: boolean;
  withFooterBorder?: boolean;
  fullScreen?: boolean;
  eventListeners?: {
    name: string;
    onAction: () => Promise<IMessage> | IMessage | Promise<void> | void;
  }[];
  onClose: () => Promise<IMessage> | IMessage | Promise<void> | void;
  onLoad: () => Promise<{
    newDialogHeader?: string;
    newDialogBody: IBox;
    newDialogFooter?: IBox;
  }>;
}
