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

import { isListedInPolicy } from "./csp-probe";

// Shaped like the img-src a cloud portal sends once a site is added in Developer Tools.
const policy =
  "default-src 'self'; script-src 'self'; img-src http://localhost:5173 https://picsum.photos 'self' data: blob: d1plvpl3ggd2qu.cloudfront.net *.googletagmanager.com";

describe("isListedInPolicy", () => {
  it("finds an origin the administrator added", () => {
    expect(isListedInPolicy(policy, "https://picsum.photos")).toBe(true);
  });
  it("does not take a redirect target for its parent", () => {
    expect(isListedInPolicy(policy, "https://fastly.picsum.photos")).toBe(false);
  });
  it("matches bare hosts and wildcards, not other schemes", () => {
    expect(isListedInPolicy(policy, "https://d1plvpl3ggd2qu.cloudfront.net")).toBe(true);
    expect(isListedInPolicy(policy, "https://www.googletagmanager.com")).toBe(true);
    expect(isListedInPolicy(policy, "https://googletagmanager.com")).toBe(false);
    expect(isListedInPolicy(policy, "https://localhost:5173")).toBe(false);
  });
  it("compares ports: a source without one allows only the default", () => {
    expect(isListedInPolicy(policy, "http://localhost:5173")).toBe(true);
    expect(isListedInPolicy(policy, "http://localhost:3000")).toBe(false);
    expect(isListedInPolicy(policy, "https://picsum.photos:8443")).toBe(false);
  });
  it("falls back to default-src without an img-src", () => {
    expect(isListedInPolicy("default-src https://a.example", "https://a.example")).toBe(true);
    expect(isListedInPolicy("script-src https://a.example", "https://a.example")).toBe(false);
  });
});
