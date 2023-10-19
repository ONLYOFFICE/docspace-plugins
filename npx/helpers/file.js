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

const IFilePlugin = "IFilePlugin";
const IFileItem = "IFileItem";

const fileItems = `
  fileItems: Map<string, IFileItem> = new Map();`;

const addFileItem = `
  addFileItem = (item: IFileItem ): void => {
    this.fileItems.set(item.extension, item);
  };`;

const getFileItems = `
  getFileItems = (): Map<string, IFileItem > => {
    return this.fileItems;
  };`;

const updateFileItem = `
  updateFileItem = (item: IFileItem): void => {
    this.fileItems.set(item.extension, item);
  };`;

export const getFileTemp = (withFile) => {
  if (!withFile)
    return {
      IFilePlugin,
      IFileItem,

      fileVars: "",
      fileMeth: "",
    };

  let fileVars = "";
  let fileMeth = "";

  fileVars = `
  ${fileItems}`;

  fileMeth = `
        ${addFileItem}
        ${getFileItems}
        ${updateFileItem}`;

  return {
    IFilePlugin,
    IFileItem,
    fileVars,
    fileMeth,
  };
};
