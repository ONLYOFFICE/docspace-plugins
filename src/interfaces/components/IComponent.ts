import { Components } from "../../enums";
import { IBox } from "./IBox";

import { IButton } from "./IButton";
import { ICheckbox } from "./ICheckbox";
import { IInput } from "./IInput";
import { IToggleButton } from "./IToggleButton";

export interface IComponent {
  component: Components;
  props: IInput | IButton | ICheckbox | IToggleButton | IBox;
}
