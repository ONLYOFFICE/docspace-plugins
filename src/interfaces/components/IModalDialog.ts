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
import { IBox } from "./IBox";

export const enum ModalDisplayType {
  modal = "modal",
  aside = "aside",
}

export interface IModalDialog {
  displayType: ModalDisplayType;
  dialogHeader?: string;
  dialogBody: IBox;
  dialogFooter?: IBox;
  autoMaxWidth?: boolean;
  autoMaxHeight?: boolean;
  withFooterBorder?: boolean;
  fullScreen?: boolean;
  eventListeners?: {
    name: string;
    onAction: () => Promise<IMessage> | IMessage | Promise<void> | void;
  }[];
  onClose: () => Promise<IMessage> | IMessage | Promise<void> | void;
  onLoad: () => Promise<{
    newDialogHeader?: string;
    newDialogBody: IBox;
    newDialogFooter?: IBox;
  }>;
}
