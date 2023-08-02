import { Actions } from "../../enums";
import {
  IBox,
  IButton,
  ICheckbox,
  IComboBox,
  ICreateDialog,
  IFrame,
  IImage,
  IInput,
  ILabel,
  IModalDialog,
  ISkeleton,
  IText,
  ITextArea,
  IToast,
  IToggleButton,
} from "../components";

export interface IMessage {
  actions?: Actions[];
  newProps?:
    | IInput
    | ICheckbox
    | IToggleButton
    | IButton
    | ITextArea
    | IComboBox;
  toastProps?: IToast[];
  contextProps?: {
    name: string;
    props:
      | IBox
      | IButton
      | ICheckbox
      | IComboBox
      | IFrame
      | IImage
      | IInput
      | ILabel
      | ISkeleton
      | IText
      | ITextArea
      | IToggleButton;
  }[];
  createDialogProps?: ICreateDialog;
  modalDialogProps?: IModalDialog;
}
