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

const IEventListenerPlugin = "IEventListenerPlugin";
const IEventListenerItem = "IEventListenerItem";

const EventListenerItems = `
  eventListenerItems: Map<string, IEventListenerItem > = new Map();`;

const addEventListenerItem = `
  addEventListenerItem = (item: IEventListenerItem ): void => {
    this.eventListenerItems.set(item.key, item);
  };`;

const getEventListenerItems = `
  getEventListenerItems = (): Map<string, IEventListenerItem > => {
    return this.eventListenerItems;
  };`;

export const getEventListenerTemp = (withEventListener) => {
  if (!withEventListener)
    return {
      IEventListenerPlugin,
      IEventListenerItem,

      eventListenerVars: "",
      eventListenerMeth: "",
    };

  let eventListenerVars = "";
  let eventListenerMeth = "";

  eventListenerVars = `
  ${EventListenerItems}`;

  eventListenerMeth = `
        ${addEventListenerItem}
        ${getEventListenerItems}`;

  return {
    IEventListenerPlugin,
    IEventListenerItem,
    eventListenerVars,
    eventListenerMeth,
  };
};
