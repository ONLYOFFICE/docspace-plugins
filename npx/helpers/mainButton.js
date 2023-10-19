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

const IMainButtonPlugin = "IMainButtonPlugin";
const IMainButtonItem = "IMainButtonItem";

const mainButtonItems = `
  mainButtonItems: Map<string, IMainButtonItem> = new Map();`;

const addMainButtonItem = `
  addMainButtonItem = (item: IMainButtonItem ): void => {
    this.mainButtonItems.set(item.key, item);
  };`;

const getMainButtonItems = `
  getMainButtonItems = (): Map<string, IMainButtonItem > => {
    return this.mainButtonItems;
  };`;

const updateMainButtonItem = `
  updateMainButtonItem = (item: IMainButtonItem): void => {
    this.mainButtonItems.set(item.key, item);
  };`;

export const getMainButtonTemp = (withMainButton) => {
  if (!withMainButton)
    return {
      IMainButtonPlugin,
      IMainButtonItem,

      mainButtonVars: "",
      mainButtonMeth: "",
    };

  let mainButtonVars = "";
  let mainButtonMeth = "";

  if (withMainButton) {
    mainButtonVars = `
  ${mainButtonItems}`;

    mainButtonMeth = `
        ${addMainButtonItem}
        ${getMainButtonItems}
        ${updateMainButtonItem}`;
  }

  return {
    IMainButtonPlugin,
    IMainButtonItem,

    mainButtonVars,
    mainButtonMeth,
  };
};
