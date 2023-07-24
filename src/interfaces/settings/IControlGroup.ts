import { ControlGroupElement } from "../../enums/Settings";
import { ITextArea } from "../components";
import { ICheckbox } from "../components/ICheckbox";
import { IInput } from "../components/IInput";
import { IToggleButton } from "../components/IToggleButton";

export interface IControlGroup {
  header: string;
  element: ControlGroupElement;
  elementProps: IInput | ITextArea | ICheckbox[] | IToggleButton[];
}
