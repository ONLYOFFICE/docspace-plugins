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

import { useEffect, type RefObject } from "react";

/**
 * On a touch screen the viewer pages and closes on a finger drag anywhere on its stage,
 * through a native listener on its wrapper (@use-gesture, bubble phase). Over a message
 * that leaves no way to select and copy text: the long press and the selection handles
 * move the whole message. So a touch that starts inside `ref` stops there. A mouse is
 * left alone - the viewer ignores drags on a desktop anyway - and the message body needs
 * nothing: a touch inside its frame never reaches this document.
 */
export function useStopViewerSwipe(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const keep = (e: Event) => {
      if (!(e instanceof PointerEvent) || e.pointerType !== "mouse") e.stopPropagation();
    };
    root.addEventListener("pointerdown", keep);
    root.addEventListener("touchstart", keep, { passive: true });
    return () => {
      root.removeEventListener("pointerdown", keep);
      root.removeEventListener("touchstart", keep);
    };
  }, [ref]);
}
