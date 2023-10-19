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

import { IMessage } from "../utils";

export const enum InputSize {
  base = "base",
  middle = "middle",
  big = "big",
  huge = "huge",
  large = "large",
}

export const enum InputAutocomplete {
  on = "on",
  off = "off",
}

export const enum InputType {
  text = "text",
  password = "password",
}

export interface IInput {
  value: string;
  onChange: (value: string) => IMessage | void;
  name?: string;
  placeholder?: string;
  maxLength?: string;
  size?: InputSize;
  isAutoFocused?: boolean;
  isReadOnly?: boolean;
  hasError?: boolean;
  hasWarning?: boolean;
  scale?: boolean;
  autoComplete?: InputAutocomplete;
  tabIndex?: number;
  mask?: [];
  isDisabled?: boolean;
  type?: InputType;
  keepCharPositions?: boolean;
  onBlur?: (value: string) => IMessage | void;
  onFocus?: (value: string) => IMessage | void;
  children?: Node[] | Node;
  iconSize?: number;
  iconName?: string;
  isIconFill?: boolean;
  iconColor?: string;
  hoverColor?: string;
  iconButtonClassName?: string;
  onIconClick?: () => void;
}
