import { IMessage } from "../utils";
import { IBox } from "./IBox";

export const enum ModalDisplayType {
  modal = "modal",
  aside = "aside",
}

export interface IModalDialog {
  dialogHeader: string;
  dialogBody: IBox;
  dialogFooter?: IBox;
  displayType: ModalDisplayType;
  visible: boolean;
  onClose: () => Promise<IMessage> | IMessage | Promise<void> | void;
  autoMaxWidth?: boolean;
  autoMaxHeight?: boolean;
  withFooterBorder?: boolean;
}
