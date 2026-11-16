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

import { describe, expect, it } from "vitest";

import { change, editOf, track } from "./edits";
import type { HtmlFile } from "./useHtmlFile";

// The store is module state: every test uses a file of its own.
const read = (version: number, source: string, fileId = 7): HtmlFile => ({
  fileId,
  title: "page.html",
  source,
  version,
  bom: false,
  eol: "\n",
  canEdit: true,
});

describe("editOf", () => {
  it("shows a newer read at once, before track() takes it in", () => {
    // What this viewer last saw of the file: version 3, emptied.
    change(read(3, ""), "");
    expect(editOf(read(3, "")).saved).toBe("");

    // Version 2 restored in the portal: the file is now version 4 with the old text.
    const restored = read(4, "<h1>Restored</h1>");
    expect(editOf(restored).saved).toBe("<h1>Restored</h1>");

    track(restored);
    expect(editOf(restored)).toMatchObject({ saved: "<h1>Restored</h1>", version: 4 });
  });

  it("keeps the viewer's own text over an older read", () => {
    change(read(5, "<p>Saved here</p>", 8), "<p>Saved here</p>");
    expect(editOf(read(4, "<p>Older</p>", 8)).saved).toBe("<p>Saved here</p>");
  });

  it("keeps a draft over a newer read", () => {
    const file = read(6, "<p>On the server</p>", 9);
    change(file, "<p>Draft</p>");
    expect(editOf(read(7, "<p>Newer</p>", 9)).draft).toBe("<p>Draft</p>");
  });
});
