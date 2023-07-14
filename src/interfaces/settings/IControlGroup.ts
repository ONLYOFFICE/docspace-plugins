import { Components } from "../../enums";
import { ITextArea } from "../components";
import { ICheckbox } from "../components/ICheckbox";
import { IInput } from "../components/IInput";
import { IToggleButton } from "../components/IToggleButton";

export const enum ControlGroupElement {
  input = Components.input,
  checkbox = Components.checkbox,
  toggleButton = Components.toggleButton,
  textArea = Components.textArea,
}

export interface IControlGroup {
  header: string;
  element: ControlGroupElement;
  elementProps: IInput | ITextArea | ICheckbox[] | IToggleButton[];
}
