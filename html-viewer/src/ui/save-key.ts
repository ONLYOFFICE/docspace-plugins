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

import type { KeyboardEvent } from "react";

// Ctrl+S (Cmd+S): the letter where the layout types one, the key's place where it does
// not - "ы" on a Cyrillic layout - so Dvorak's Ctrl+O is not taken for a save.
export const isSaveKey = (e: KeyboardEvent) =>
  (e.ctrlKey || e.metaKey) &&
  !e.altKey &&
  !e.shiftKey &&
  (/^[a-z]$/i.test(e.key) ? e.key.toLowerCase() === "s" : e.code === "KeyS");
