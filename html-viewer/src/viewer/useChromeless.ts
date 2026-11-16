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

import { useSyncExternalStore } from "react";

// The test the viewer makes before drawing its header, close cross and side arrows: the
// portal's mobile width (600px) or a touch screen. Where it passes there are none, and
// the plugin draws its own.
const CHROMELESS = "(max-width: 600px), (pointer: coarse)";

const watchChromeless = (onChange: () => void) => {
  const query = matchMedia(CHROMELESS);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isChromeless = () => matchMedia(CHROMELESS).matches;

export const useChromeless = (): boolean =>
  useSyncExternalStore(watchChromeless, isChromeless, () => false);
