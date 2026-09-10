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

import type { ReactNode } from "react";

const URL_RE = /(https?:\/\/[^\s<>"']+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;

/**
 * Plain-text bodies are rendered by React (which escapes them), so the only thing
 * to add is clickable URLs. Trailing punctuation is left outside the link.
 */
export function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(URL_RE)) {
    const start = match.index ?? 0;
    let url = match[0];
    const trailing = url.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    url = url.slice(0, url.length - trailing.length);
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <a key={key++} href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>,
    );
    if (trailing) out.push(trailing);
    last = start + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
