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

import { buildHtmlDocument, decodeHtml, hasRemoteReferences } from "./document";

const template = `<!DOCTYPE html>
<html lang="en"><head>
<meta name="viewport" content="width=device-width">
<style>@media (max-width: 480px) { .wrap { width: 100% !important; } }</style>
</head>
<body bgcolor="#f4f4f4" style="margin:0">
<table class="wrap" width="600"><tr><td>Hello</td></tr></table>
</body></html>`;

describe("buildHtmlDocument", () => {
  it("strips scripts, handlers and forms", () => {
    const doc = buildHtmlDocument(
      '<p onclick="x()">Hi</p><script>alert(1)</script><img src="x" onerror="alert(2)"><form><input><button>Submit</button><span>kept</span></form>',
      { allowRemote: false },
    );
    expect(doc).not.toContain("<script");
    expect(doc).not.toContain("alert(");
    expect(doc).not.toContain("onclick");
    expect(doc).not.toContain("<form");
    expect(doc).not.toContain("Submit");
    expect(doc).toContain("<span>kept</span>");
    expect(doc).toContain("<p>Hi</p>");
  });

  it("keeps the template's head styles and body attributes, after the base rules", () => {
    const doc = buildHtmlDocument(template, { allowRemote: false });
    expect(doc).toMatch(/^<!doctype html>\n<html lang="en">/);
    expect(doc).toContain("@media (max-width: 480px)");
    expect(doc).toMatch(/<body [^>]*bgcolor="#f4f4f4"/);
    expect(doc).toContain('<table class="wrap" width="600">');
    expect(doc).not.toContain("viewport");
    // Base rules and the policy come first, so the template's own rules win.
    expect(doc.indexOf('<base target="_blank">')).toBeLessThan(doc.indexOf("@media"));
    expect(doc.indexOf("Content-Security-Policy")).toBeLessThan(doc.indexOf("<style>"));
  });

  it("keeps a style block wrapped in an HTML comment", () => {
    const doc = buildHtmlDocument(
      "<html><head><style><!-- .x { color: red } --></style></head><body>x</body></html>",
      { allowRemote: false },
    );
    expect(doc).toContain(".x { color: red }");
  });

  it("blocks remote content through CSP unless allowed", () => {
    const html = '<img src="https://t.example/pixel.gif">';
    const blocked = buildHtmlDocument(html, { allowRemote: false });
    const allowed = buildHtmlDocument(html, { allowRemote: true });
    expect(blocked).toMatch(/img-src data:;/);
    expect(allowed).toMatch(/img-src data: https: http:;/);
    expect(blocked).toContain('src="https://t.example/pixel.gif"');
  });
});

describe("hasRemoteReferences", () => {
  it("detects src, background and css url()", () => {
    expect(hasRemoteReferences('<img src="https://a/b.png">')).toBe(true);
    expect(hasRemoteReferences('<td background="http://a/b.png">')).toBe(true);
    expect(hasRemoteReferences("<style>div{background:url(https://a/b.png)}</style>")).toBe(true);
  });

  it("ignores links and inline data", () => {
    expect(
      hasRemoteReferences('<a href="https://a">x</a><img src="data:image/png;base64,AA">'),
    ).toBe(false);
  });
});

describe("decodeHtml", () => {
  const ascii = (s: string) => Array.from(s, (c) => c.charCodeAt(0));
  const privet = [0xcf, 0xf0, 0xe8, 0xe2, 0xe5, 0xf2]; // "Привет" in windows-1251

  it("honours a charset declared in a meta tag", () => {
    const short = new Uint8Array([...ascii('<meta charset="windows-1251"><p>'), ...privet]);
    const long = new Uint8Array([
      ...ascii('<meta http-equiv="Content-Type" content="text/html; charset=windows-1251"><p>'),
      ...privet,
    ]);
    expect(decodeHtml(short.buffer)).toContain("Привет");
    expect(decodeHtml(long.buffer)).toContain("Привет");
  });

  it("falls back to UTF-8", () => {
    const utf8 = new TextEncoder().encode("<p>Привет</p>");
    expect(decodeHtml(utf8.buffer as ArrayBuffer)).toBe("<p>Привет</p>");
    const unknown = new TextEncoder().encode('<meta charset="no-such-charset"><p>Привет</p>');
    expect(decodeHtml(unknown.buffer as ArrayBuffer)).toContain("Привет");
  });
});
