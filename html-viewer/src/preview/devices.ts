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

export type Device = "desktop" | "tablet" | "mobile";

export type DeviceSize = { value: Device; width?: number; height?: number };

// Common viewports: each wide enough for a template's media queries at that size to apply.
export const DEVICES: DeviceSize[] = [
  { value: "desktop" },
  { value: "tablet", width: 768, height: 1024 },
  { value: "mobile", width: 375, height: 812 },
];

// What a framed device needs beyond its own width: the canvas padding and the bezel,
// both sides (.stage[data-framed] and .device in preview.module.css).
const FRAME = 2 * 24 + 2 * 10;

/** The devices whose frame fits a card this wide: a phone frame on a phone is no preview. */
export const devicesFor = (cardWidth: number): DeviceSize[] =>
  DEVICES.filter((d) => !d.width || d.width + FRAME <= cardWidth);
