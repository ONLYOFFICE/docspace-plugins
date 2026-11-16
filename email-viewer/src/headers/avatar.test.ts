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

import { avatarColor, initials } from "./avatar";

describe("initials", () => {
  it("takes the first letters of two name words", () => {
    expect(initials({ name: "Anna Smith", address: "a@example.com" })).toBe("AS");
    expect(initials({ name: "ONLYOFFICE News", address: "" })).toBe("ON");
  });
  it("falls back to the address before the @", () => {
    expect(initials({ name: "", address: "kees.van.spelde@example.com" })).toBe("KV");
  });
  it("keeps a letter outside the BMP whole and never returns nothing", () => {
    expect(initials({ name: "𝓐lice", address: "" })).toBe("𝓐");
    expect(initials({ name: "", address: "" })).toBe("?");
  });
});

describe("avatarColor", () => {
  it("is stable per address and ignores case", () => {
    const a = avatarColor({ name: "A", address: "News@Example.com" });
    expect(avatarColor({ name: "B", address: "news@example.com" })).toBe(a);
  });
});
