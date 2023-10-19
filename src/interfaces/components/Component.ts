/*
* (c) Copyright Ascensio System SIA 2023
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { Components } from "../../enums";

import { IBox } from "./IBox";
import { IButton } from "./IButton";
import { ICheckbox } from "./ICheckbox";
import { IComboBox } from "./IComboBox";
import { IFrame } from "./IFrame";
import { IImage } from "./IImage";
import { IInput } from "./IInput";
import { ILabel } from "./ILabel";
import { ISkeleton } from "./ISkeleton";
import { IText } from "./IText";
import { ITextArea } from "./ITextArea";
import { IToggleButton } from "./IToggleButton";

type BoxGroup = {
  component: Components.box;
  props: IBox;
  contextName?: string;
};

type ButtonGroup = {
  component: Components.button;
  props: IButton;
  contextName?: string;
};

type CheckboxGroup = {
  component: Components.checkbox;
  props: ICheckbox;
  contextName?: string;
};

type ComboBoxGroup = {
  component: Components.comboBox;
  props: IComboBox;
  contextName?: string;
};

type IFrameGroup = {
  component: Components.iFrame;
  props: IFrame;
  contextName?: string;
};

type ImageGroup = {
  component: Components.img;
  props: IImage;
  contextName?: string;
};

type InputGroup = {
  component: Components.input;
  props: IInput;
  contextName?: string;
};

type LabelGroup = {
  component: Components.label;
  props: ILabel;
  contextName?: string;
};

type SkeletonGroup = {
  component: Components.skeleton;
  props: ISkeleton;
  contextName?: string;
};

type TextGroup = {
  component: Components.text;
  props: IText;
  contextName?: string;
};

type TextAreaGroup = {
  component: Components.textArea;
  props: ITextArea;
  contextName?: string;
};

type ToggleButtonGroup = {
  component: Components.toggleButton;
  props: IToggleButton;
  contextName?: string;
};

type Component =
  | BoxGroup
  | ButtonGroup
  | CheckboxGroup
  | ComboBoxGroup
  | IFrameGroup
  | ImageGroup
  | InputGroup
  | LabelGroup
  | SkeletonGroup
  | TextGroup
  | TextAreaGroup
  | ToggleButtonGroup;

export {
  Component,
  BoxGroup,
  ButtonGroup,
  CheckboxGroup,
  ComboBoxGroup,
  IFrameGroup,
  ImageGroup,
  InputGroup,
  LabelGroup,
  SkeletonGroup,
  TextGroup,
  TextAreaGroup,
  ToggleButtonGroup,
};
