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

import { highlight, tokenize, type TokenKind } from "./highlight";

const page = `<!DOCTYPE html>
<!-- header -->
<html lang="en"><head>
<style>
  @media (max-width: 480px) { .wrap, a:hover { width: 100% !important; } }
  body { color: #333; font: 12px/1.5 "Open Sans"; }
</style>
<script>const n = 1; // note
</script>
</head>
<body style="margin:0; background:url(http://x/y.png)">
<table class="wrap" width=600><tr><td>Tom &amp; Jerry <b>&lt;3</b></td></tr></table>
<img src=x alt='a > b'/>
<p>unclosed <a href="x
</body></html>`;

const kindsOf = (source: string, kind: TokenKind): string[] =>
  tokenize(source)
    .filter(([k]) => k === kind)
    .map(([, text]) => text);

describe("tokenize", () => {
  it("loses nothing: the runs join back into the source", () => {
    expect(
      tokenize(page)
        .map(([, text]) => text)
        .join(""),
    ).toBe(page);
  });

  it("colours markup", () => {
    expect(kindsOf(page, "tag")).toEqual(
      expect.arrayContaining(["html", "style", "script", "body", "table", "img", "a"]),
    );
    expect(kindsOf(page, "attr")).toEqual(
      expect.arrayContaining(["lang", "style", "class", "width", "src", "alt", "href"]),
    );
    expect(kindsOf(page, "string")).toEqual(
      expect.arrayContaining(['"en"', '"wrap"', "600", "'a > b'", '"Open Sans"']),
    );
    expect(kindsOf(page, "comment")).toEqual(["<!-- header -->", "// note"]);
    expect(kindsOf(page, "keyword")).toEqual(
      expect.arrayContaining(["<!DOCTYPE html>", "@media", "!important", "const"]),
    );
    expect(kindsOf(page, "entity")).toEqual(["&amp;", "&lt;"]);
  });

  it("tells selectors, properties and values apart, in blocks and in style attributes", () => {
    expect(kindsOf(page, "selector")).toEqual([".wrap", "a", "hover", "body"]);
    expect(kindsOf(page, "property")).toEqual(["width", "color", "font", "margin", "background"]);
    expect(kindsOf(page, "number")).toEqual(
      expect.arrayContaining(["480px", "100%", "#333", "12px", "1.5", "0"]),
    );
    // A URL in a value is not a property, and its slashes are not a comment.
    expect(kindsOf(page, "property")).not.toContain("http");
  });

  it("treats the inside of <script> and <style> as raw text, not markup", () => {
    const tags = kindsOf("<script>if (a<b) x = '<p>';</script>", "tag");
    expect(tags).toEqual(["script", "script"]);
  });

  it("reads url(...) as one value: the ';' of a data URI does not start a property", () => {
    const style =
      "<style>div{background:url(data:image/png;base64,AAAA/BBB+CCC=);color:red}</style>";
    expect(kindsOf(style, "property")).toEqual(["background", "color"]);
    expect(kindsOf(style, "string")).toEqual(["url(data:image/png;base64,AAAA/BBB+CCC=)"]);
  });

  it("stays linear on large embedded data and does not overflow on long strings", () => {
    const words = "AAAA/".repeat(200_000); // 1 MB of base64-like words after a ';'
    let started = performance.now();
    tokenize(`<style>@font-face{src:url(data:font/woff2;base64,${words})}</style>`);
    tokenize(`<style>a{b:c;${words}}</style>`);
    expect(performance.now() - started).toBeLessThan(1500);

    started = performance.now();
    const long = "x".repeat(12_000_000);
    expect(() => tokenize(`<style>a{content:"${long}"}</style><a title="${long}">`)).not.toThrow();
    expect(() =>
      tokenize(`<script>const s = \`${long}\`; const t = "${long}";</script>`),
    ).not.toThrow();
  }, 20_000);
});

describe("highlight", () => {
  it("escapes every character a page could use to break out", () => {
    const html = highlight('<img src=x onerror="alert(1)">&lt;script&gt;<script>"</script>');
    const host = document.createElement("div");
    host.innerHTML = html;
    expect(host.querySelector("img, script")).toBeNull();
    expect(host.textContent).toBe('<img src=x onerror="alert(1)">&lt;script&gt;<script>"</script>');
  });

  it("emits one line per source line, including blank and CRLF ones", () => {
    const host = document.createElement("div");
    host.innerHTML = highlight("<!-- a\r\nb -->\r\n\r\n<p>");
    const lines = [...host.querySelectorAll(".hv-l")].map((l) => l.textContent);
    expect(lines).toEqual(["<!-- a", "b -->", "", "<p>"]);
    // A comment that spans lines is reopened on each, so both halves keep their colour.
    expect(host.querySelectorAll(".hv-l > .hv-comment")).toHaveLength(2);
  });
});
