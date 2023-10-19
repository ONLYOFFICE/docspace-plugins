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

import { Component } from "./Component";

export interface IBorderProp {
  color: string;
  radius: string;
  style: string;
  width: string;
}

export interface IBox {
  widthProp?: string;
  paddingProp?: string;
  displayProp?: string;
  flexDirection?: string;
  alignItems?: string;
  borderProp?: string | IBorderProp;
  alignContent?: string;
  alignSelf?: string;
  backgroundProp?: string;
  flexBasis?: string;
  flexProp?: string;
  flexWrap?: string;
  gridArea?: string;
  heightProp?: string;
  justifyContent?: string;
  justifyItems?: string;
  justifySelf?: string;
  marginProp?: string;
  overflowProp?: string;
  textAlign?: string;
  children?: Component[];
}
