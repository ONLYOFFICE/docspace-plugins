import { describe, expect, it } from "vitest";

import { buildHtmlDocument, hasRemoteReferences } from "./body-document";
import type { EmailAttachment } from "./types";

const png: EmailAttachment = {
  name: "logo.png",
  mimeType: "image/png",
  size: 3,
  content: new Uint8Array([1, 2, 3]),
  contentId: "Logo@Example",
  inline: true,
};

describe("buildHtmlDocument", () => {
  it("strips scripts and event handlers, keeps head styles", () => {
    const doc = buildHtmlDocument(
      '<html><head><style>p{color:red}</style></head><body><p onclick="x()">Hi</p><script>alert(1)</script><form><input><button>Submit</button><span>kept</span></form></body></html>',
      [],
      { allowRemote: false },
    );
    expect(doc).not.toContain("<script");
    expect(doc).not.toContain("alert(1)");
    expect(doc).not.toContain("onclick");
    expect(doc).not.toContain("<form");
    expect(doc).not.toContain("Submit");
    expect(doc).toContain("<span>kept</span>");
    expect(doc).toContain("<style>p{color:red}</style>");
    expect(doc).toContain("<p>Hi</p>");
    expect(doc).toContain('<base target="_blank">');
  });

  it("inlines cid images case-insensitively and drops unknown ones", () => {
    const doc = buildHtmlDocument(
      '<img src="cid:logo@example"><img src="cid:missing" alt="x">',
      [png],
      { allowRemote: false },
    );
    expect(doc).toContain('src="data:image/png;base64,AQID"');
    expect(doc).not.toContain("cid:missing");
    expect(doc).toContain('alt="x"');
  });

  it("blocks remote images through CSP unless allowed", () => {
    const html = '<img src="https://t.example/pixel.gif">';
    const blocked = buildHtmlDocument(html, [], { allowRemote: false });
    const allowed = buildHtmlDocument(html, [], { allowRemote: true });
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
    expect(hasRemoteReferences('<img src="cid:x">')).toBe(false);
  });
});
