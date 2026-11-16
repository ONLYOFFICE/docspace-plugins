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

import { contentIdKey } from "./content-id";

describe("contentIdKey", () => {
  it("decodes the escapes a cid: URL carries and ignores case", () => {
    expect(contentIdKey("Logo%40Example.COM")).toBe("logo@example.com");
  });

  it("keeps a malformed escape as written instead of throwing", () => {
    expect(contentIdKey("%zz")).toBe("%zz");
    expect(contentIdKey("Part%")).toBe("part%");
  });
});
