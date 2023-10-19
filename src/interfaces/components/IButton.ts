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

export const enum ButtonSize {
  extraSmall = "extra-small",
  small = "small",
  normal = "normal",
  medium = "medium",
}

export interface IButton {
  label: string;
  size: ButtonSize;
  onClick: () => Promise<IMessage> | IMessage | void;
  primary?: boolean;
  scale?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  withLoadingAfterClick?: boolean;
  disableWhileRequestRunning?: boolean;
}
