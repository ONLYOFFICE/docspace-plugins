import { Actions } from "../../enums";
import {
  IBox,
  IButton,
  ICheckbox,
  ICreateDialog,
  IFrame,
  IImage,
  IInput,
  ILabel,
  IModalDialog,
  IText,
  ITextArea,
  IToast,
  IToggleButton,
} from "../components";

export interface IMessage {
  actions?: Actions[];
  newProps?: IInput | ICheckbox[] | IToggleButton[] | IButton | ITextArea;
  toastProps?: IToast[];
  acceptButtonProps?: IButton;
  contextProps?: {
    name: string;
    props:
      | IInput
      | IButton
      | ICheckbox
      | IToggleButton
      | IBox
      | IText
      | ITextArea
      | ILabel
      | IFrame
      | IImage;
  };
  createDialogProps?: ICreateDialog;
  modalDialogProps?: IModalDialog;
}
