import { IMessage } from "../utils";
import { IComboBoxItem } from "./IComboBox";

export interface ICreateDialog {
  title: string;
  startValue: string;
  visible: boolean;
  options?: IComboBoxItem[];
  selectedOption?: IComboBoxItem;
  onSelect?: (option: IComboBoxItem) => IMessage | void;
  onSave?: (
    e: any,
    value: string
  ) => Promise<IMessage> | Promise<void> | IMessage | void;
  onCancel?: (e: any) => void;
  onClose?: (e: any) => void;
  isCreateDialog: boolean;
  extension?: string;
}
