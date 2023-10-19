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

const IApiPlugin = "IApiPlugin";
const origin = `origin = "";`;
const proxy = `proxy = "";`;
const prefix = `prefix = "";`;
const setOrigin = `
  setOrigin = (origin: string): void => {
    this.origin = origin;
  };`;

const getOrigin = `
  getOrigin = (): string => {
    return this.origin;
  };`;

const setProxy = `
  setProxy = (proxy: string): void => {
    this.proxy = proxy;
  };`;

const getProxy = `
  getProxy = (): string => {
    return this.proxy;
  };`;

const setPrefix = `
  setPrefix = (prefix: string): void => {
    this.prefix = prefix;
  };`;

const getPrefix = `
  getPrefix = (): string => {
    return this.prefix;
  };`;

const setAPI = `
  setAPI = (origin: string, proxy: string, prefix: string): void => {
    this.origin = origin;
    this.proxy = proxy;
    this.prefix = prefix;
  };`;

const getAPI = `
  getAPI = (): { origin: string; proxy: string; prefix: string } => {
    return { origin: this.origin, proxy: this.proxy, prefix: this.prefix };
  };`;

export const getApiTemp = (withApi) => {
  if (!withApi) return { apiVars: "", apiMeth: "", IApiPlugin };
  let apiVars = "";
  let apiMeth = "";

  if (withApi) {
    apiVars = `
  ${origin}
  ${proxy}
  ${prefix}`;

    apiMeth = `
            ${setOrigin}
            ${getOrigin}
            ${setProxy}
            ${getProxy}
            ${setPrefix}
            ${getPrefix}
            ${setAPI}
            ${getAPI}`;
  }

  return { apiVars, apiMeth, IApiPlugin };
};
