/*
 * (c) Copyright Ascensio System SIA 2026
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

import { SelectorType, TSelector } from "@onlyoffice/docspace-plugin-sdk";

export const selectorProps: TSelector = {
  type: SelectorType.Files,
  props: {
    currentFolderId: undefined,
    isMultiSelect: false,
    withBreadCrumbs: true,
    getIsDisabled: () => false,
    onLoad: () => {},

    withHeader: true,
    headerProps: {
      label: "",
      isCloseable: true,
      onCloseClick: () => {},
    },

    withCancelButton: true,
    cancelButtonLabel: "",
    onCancel: () => {},

    withFooterCheckbox: false,
    footerCheckboxLabel: "",

    submitButtonLabel: "",
    onSubmit: () => {},
  },
};
