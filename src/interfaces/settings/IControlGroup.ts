import { ICheckbox } from "../components/ICheckbox";
import { IInput } from "../components/IInput";
import { IToggleButton } from "../components/IToggleButton";

export const enum ControlGroupElement {
  input = "input",
  checkbox = "checkbox",
  toggleButton = "toggle-button",
}

export interface IControlGroup {
  header: string;
  element: ControlGroupElement;
  elementProps: IInput | ICheckbox[] | IToggleButton[];
}
