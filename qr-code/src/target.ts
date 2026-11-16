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

/**
 * A context menu click only hands `onItemClick` the clicked entity's id — the
 * modal it opens gets no current file at all (react.md - what useCurrentFile
 * returns where). So the id, and which link endpoint it needs, is captured
 * here right before the modal is requested and read back once inside it.
 */
export type TTargetKind = "file" | "folder";

export type TTarget = {
  id: string | number;
  kind: TTargetKind;
  isRoom?: boolean;
};

let target: TTarget | null = null;

export const setTarget = (next: TTarget): void => {
  target = next;
};

export const getTarget = (): TTarget | null => target;
