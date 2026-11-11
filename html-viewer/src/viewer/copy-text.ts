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
 * Puts `text` on the clipboard. The Clipboard API exists only in a secure context, so a
 * portal served over plain http - an on-premises install on a local address - has no
 * navigator.clipboard. There the text goes through a hidden textarea and the copy
 * command, which browsers still carry out inside a click.
 *
 * The textarea goes into `container`, inside the plugin: the media viewer keeps the
 * focus within itself, and a textarea in the body would lose its selection before the
 * copy. The focus then goes back where it was.
 */
export async function copyText(text: string, container: HTMLElement): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const previous = document.activeElement as HTMLElement | null;
  const area = document.createElement("textarea");
  area.value = text;
  area.readOnly = true;
  area.style.position = "fixed";
  area.style.inset = "0 auto auto 0";
  area.style.opacity = "0";
  container.appendChild(area);
  try {
    area.select();
    if (!document.execCommand("copy")) throw new Error("The browser refused to copy.");
  } finally {
    area.remove();
    previous?.focus();
  }
}
