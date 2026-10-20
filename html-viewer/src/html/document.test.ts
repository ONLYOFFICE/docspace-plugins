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

import { buildHtmlDocument, decodeHtml } from "./document";

const template = `<!DOCTYPE html>
<html lang="en"><head>
<meta name="viewport" content="width=device-width">
<style>@media (max-width: 480px) { .wrap { width: 100% !important; } }</style>
</head>
<body bgcolor="#f4f4f4" style="margin:0">
<table class="wrap" width="600"><tr><td>Hello</td></tr></table>
</body></html>`;

const build = (source: string) => buildHtmlDocument(source).html;
const remote = (source: string) => buildHtmlDocument(source).remote;

describe("buildHtmlDocument", () => {
  it("strips scripts, handlers and forms", () => {
    const doc = build(
      '<p onclick="x()">Hi</p><script>alert(1)</script><img src="x" onerror="alert(2)"><form><input><button>Submit</button><span>kept</span></form>',
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
    const doc = build(template);
    expect(doc).toMatch(/^<!doctype html>\n<html lang="en">/);
    expect(doc).toContain("@media (max-width: 480px)");
    expect(doc).toMatch(/<body [^>]*bgcolor="#f4f4f4"/);
    expect(doc).toContain('<table class="wrap" width="600">');
    expect(doc).not.toContain("viewport");
    // Base rules and the policy come first, so the template's own rules win.
    expect(doc.indexOf("<base ")).toBeLessThan(doc.indexOf("@media"));
    expect(doc.indexOf("Content-Security-Policy")).toBeLessThan(doc.indexOf("<style>"));
  });

  it("keeps style blocks whose text holds '<': comment wrappers, CDATA, ranges, tags in comments", () => {
    const styles = [
      ["<style><!-- .x { color: red } --></style>", ".x { color: red }"],
      ["<style>/*<![CDATA[*/ .a{color:red} /*]]>*/</style>", ".a{color:red}"],
      ["<style>@media (width<600px) { .b { color: red } }</style>", "(width< 600px)"],
      ["<style>/* Outlook <table> fix */ .c{color:red}</style>", ".c{color:red}"],
      ['<style>.d::before { content: "<b>" }</style>', 'content: "\\3c b>"'],
    ];
    for (const [style, kept] of styles)
      expect(build(`<html><head>${style}</head><body>x</body></html>`)).toContain(kept);
  });

  it("leaves remote resources to the portal's policy and turns everything else off", () => {
    const doc = build('<img src="https://t.example/pixel.gif">');
    expect(doc).toContain("default-src 'none'");
    expect(doc).toMatch(/img-src data: https: http:;/);
    expect(doc).not.toMatch(/script-src|connect-src|frame-src/);
    expect(doc).toContain('src="https://t.example/pixel.gif"');
  });

  it("keeps in-page links in the frame and resolves nothing against the portal", () => {
    const doc = build('<a href="#part">Part</a><a href="https://a.example">Away</a>');
    expect(doc).toContain('<base href="about:srcdoc" target="_blank">');
    expect(doc).toContain('<a href="#part" target="_self">Part</a>');
    expect(doc).toContain('<a href="https://a.example">Away</a>');
  });

  it("keeps what a browser without scripts draws: stylesheets, inline SVG, body colours", () => {
    const doc = build(
      '<html><head><link rel="stylesheet" href="https://cdn.example/x.css"><link rel="preload" href="https://cdn.example/y.js"></head>' +
        '<body text="#ffffff" link="#00ff00" bgcolor="#000000"><svg width="10" height="10"><rect width="10" height="10"/></svg></body></html>',
    );
    expect(doc).toContain('<link rel="stylesheet" href="https://cdn.example/x.css">');
    expect(doc).not.toContain("preload");
    expect(doc).toMatch(/<body [^>]*text="#ffffff"/);
    expect(doc).toContain("<rect");
  });
});

describe("buildHtmlDocument().remote", () => {
  it("finds images, backgrounds, CSS url() and @import of other sites, protocol-relative too", () => {
    expect(remote('<img src="https://a/b.png">')).toBe(true);
    expect(remote('<table><tr><td background="http://a/b.png">x</td></tr></table>')).toBe(true);
    expect(remote("<style>div{background:url(https://a/b.png)}</style>")).toBe(true);
    expect(remote('<div style="background:url(&quot;https://a/b.png&quot;)">x</div>')).toBe(true);
    expect(remote('<img src="//cdn.example/b.png">')).toBe(true);
    expect(remote('<style>@import "https://fonts.example/css2?family=Inter";</style>')).toBe(true);
    expect(remote('<link rel="stylesheet" href="https://cdn.example/x.css">')).toBe(true);
  });

  it("ignores links, inline data, removed scripts and URLs that are only text", () => {
    expect(remote('<a href="https://a">x</a><img src="data:image/png;base64,AA">')).toBe(false);
    expect(remote('<script src="https://cdn.example/x.js"></script><p>x</p>')).toBe(false);
    expect(remote('<img data-src="https://a/b.png"><code>&lt;img src="https://a"&gt;</code>')).toBe(
      false,
    );
  });

  it("does not stall on a long run of spaces", () => {
    const started = performance.now();
    remote(
      `<style>div{background:url(${" ".repeat(200_000)}x)}</style><p src=${" ".repeat(200_000)}>`,
    );
    expect(performance.now() - started).toBeLessThan(1000);
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
    expect(decodeHtml(short.buffer).text).toContain("Привет");
    expect(decodeHtml(long.buffer).text).toContain("Привет");
    // Saved back as UTF-8, it needs a BOM to outrank its own declaration.
    expect(decodeHtml(short.buffer).bom).toBe(true);
  });

  it("falls back to UTF-8", () => {
    const utf8 = new TextEncoder().encode("<p>Привет</p>");
    expect(decodeHtml(utf8.buffer as ArrayBuffer)).toEqual({
      text: "<p>Привет</p>",
      bom: false,
      exact: true,
    });
    const unknown = new TextEncoder().encode('<meta charset="no-such-charset"><p>Привет</p>');
    expect(decodeHtml(unknown.buffer as ArrayBuffer).text).toContain("Привет");
  });

  it("lets a byte order mark outrank the declared charset, as a browser does", () => {
    const utf8 = new Uint8Array([
      0xef,
      0xbb,
      0xbf,
      ...new TextEncoder().encode('<meta charset="windows-1251"><p>Привет'),
    ]);
    expect(decodeHtml(utf8.buffer)).toEqual({
      text: '<meta charset="windows-1251"><p>Привет',
      bom: true,
      exact: true,
    });

    const text = "<p>Привет</p>";
    const utf16 = new Uint8Array(2 + text.length * 2);
    utf16.set([0xff, 0xfe]);
    for (let i = 0; i < text.length; i++) {
      utf16[2 + i * 2] = text.charCodeAt(i) & 0xff;
      utf16[3 + i * 2] = text.charCodeAt(i) >> 8;
    }
    expect(decodeHtml(utf16.buffer)).toEqual({ text, bom: true, exact: true });
  });

  it("reads a page that claims UTF-16 without a BOM as UTF-8, whatever the label", () => {
    for (const label of ["utf-16", "unicode", "ucs-2"]) {
      const bytes = new TextEncoder().encode(`<meta charset="${label}"><p>Привет</p>`);
      expect(decodeHtml(bytes.buffer as ArrayBuffer)).toMatchObject({
        text: expect.stringContaining("Привет"),
        bom: false,
      });
    }
  });

  it("marks bytes that do not fit the encoding, so the text is never written back", () => {
    // "Café" in windows-1252 with no meta: 0xE9 is not UTF-8.
    const bytes = new Uint8Array([...ascii("<p>Caf"), 0xe9, ...ascii("</p>")]);
    const decoded = decodeHtml(bytes.buffer);
    expect(decoded.exact).toBe(false);
    expect(decoded.text).toContain("�");
  });
});
