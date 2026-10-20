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

import DOMPurify from "dompurify";

/**
 * Turns an HTML file into a complete document for a sandboxed `<iframe srcdoc>`.
 * The same three layers as email-viewer's body-document.ts keep the page from
 * reaching the portal:
 *
 * 1. DOMPurify strips scripts, event handlers, forms and anything that is not
 *    plain presentational markup.
 * 2. The iframe is sandboxed by the component (no scripts, no same-origin), so
 *    even a sanitiser miss cannot touch the portal's DOM or cookies.
 * 3. A CSP `<meta>` inside the document turns off everything but images, fonts,
 *    stylesheets and media. Those it leaves to the portal's own policy, which a
 *    srcdoc document inherits and a meta tag can only narrow: by default it admits
 *    only the portal itself and `data:` URIs, and the sites an administrator adds in
 *    Developer tools - JavaScript SDK load too. A narrower list here would refuse
 *    the very sites the administrator chose to trust.
 *
 * Unlike a message body, a template is shown whole: the attributes of `<html>` and
 * `<body>` survive (a template's background is often `bgcolor` on `<body>`), and the
 * few base rules go first in `<head>`, so any rule of the template's own wins.
 */

// DOMPurify drops a whole <style> whose text holds "<" before a letter, "/" or "!" (an
// mXSS guard), so a CDATA wrapper, a <td> in a comment or `(width<600px)` would cost a
// template every rule it has. The "<!--" and "-->" of older templates are markers CSS
// skips anyway; any other "<" becomes "< " before a digit - still a media query range -
// and otherwise the escape \3c, which is "<" in a string and nothing in a comment.
const keepStyle = (node: Node): void => {
  if (node.nodeName !== "STYLE" || !node.textContent) return;
  node.textContent = node.textContent
    .replace(/<!--|-->/g, "")
    .replace(/<(?=[/\w!])/g, (_, at: number, css: string) =>
      /\d/.test(css[at + 1]) ? "< " : "\\3c ",
    );
};

// In-page links scroll the preview; every other link opens in a new tab (the base target).
const keepAnchors = (node: Element): void => {
  if (node.tagName === "A" && node.getAttribute("href")?.startsWith("#"))
    node.setAttribute("target", "_self");
};

const REMOTE_URL = /^\s*(?:https?:)?\/\//i;
// No two quantifiers can share a run of spaces, so a long one cannot make these backtrack.
const REMOTE_CSS = /url\(\s*(?:["']\s*)?(?:https?:)?\/\/|@import\s+(?:["']\s*)?(?:https?:)?\/\//i;

/**
 * Does the page use images, backgrounds, fonts or stylesheets of another site? Read off
 * the sanitised tree: a script the sanitiser removed is no missing image, and text that
 * only shows a URL is not a request.
 */
const usesOtherSites = (root: Element): boolean => {
  const attr = (selector: string, name: string) =>
    [...root.querySelectorAll(selector)].map((el) => el.getAttribute(name) ?? "");
  const urls = [
    ...attr("[src]", "src"),
    ...attr("[background]", "background"),
    ...attr("[poster]", "poster"),
    ...attr("link[href]", "href"),
    ...attr("image[href]", "href"),
  ];
  const css = [
    ...attr("[style]", "style"),
    ...[...root.querySelectorAll("style")].map((el) => el.textContent ?? ""),
  ];
  return urls.some((url) => REMOTE_URL.test(url)) || css.some((text) => REMOTE_CSS.test(text));
};

const CSP = [
  "default-src 'none'",
  "img-src data: https: http:",
  "style-src 'unsafe-inline' https: http:",
  "font-src data: https: http:",
  "media-src data: https: http:",
].join("; ");

// Only what a bare page needs to read well. No background: the frame element is white,
// and a background here would paint over a template's `<body bgcolor>`.
const BASE_STYLE =
  "body { margin: 0; padding: 16px; font-family: Arial, sans-serif; overflow-wrap: break-word; }";

export type PreviewDocument = {
  html: string;
  /** The page uses resources of other sites, which load only where the portal allows. */
  remote: boolean;
};

export function buildHtmlDocument(source: string): PreviewDocument {
  // Added per call, not at module scope: without a DOM - where the bundle is first
  // evaluated by tooling - DOMPurify is a bare factory with no addHook to call.
  DOMPurify.addHook("beforeSanitizeElements", keepStyle);
  DOMPurify.addHook("afterSanitizeAttributes", keepAnchors);
  let root: HTMLElement;
  try {
    root = sanitize(source);
  } finally {
    DOMPurify.removeHook("beforeSanitizeElements", keepStyle);
    DOMPurify.removeHook("afterSanitizeAttributes", keepAnchors);
  }

  // Of the links, only stylesheets: a preload or an icon is a request with nothing to show.
  for (const link of root.querySelectorAll("link"))
    if (!/(?:^|\s)stylesheet(?:\s|$)/i.test(link.getAttribute("rel") ?? "")) link.remove();

  const remote = usesOtherSites(root);

  // WHOLE_DOCUMENT hands back the <html> element, with <head> and <body> in place.
  // about:srcdoc as the base: a relative URL resolves to nothing rather than to the
  // portal page around the frame, and "#section" stays in this document.
  (root.querySelector("head") ?? root).insertAdjacentHTML(
    "afterbegin",
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">` +
      '<base href="about:srcdoc" target="_blank">' +
      `<style>${BASE_STYLE}</style>`,
  );

  return { html: `<!doctype html>\n${root.outerHTML}`, remote };
}

const sanitize = (html: string): HTMLElement =>
  DOMPurify.sanitize(html, {
    WHOLE_DOCUMENT: true,
    RETURN_DOM: true,
    ADD_TAGS: ["link"],
    // The colours of an old-style <body>: without `text` a dark template is black on black.
    ADD_ATTR: ["text", "link", "vlink", "alink"],
    FORBID_TAGS: [
      "form",
      "input",
      "button",
      "select",
      "textarea",
      "option",
      "meta",
      "base",
      "iframe",
      "object",
      "embed",
    ],
    FORBID_ATTR: ["srcset", "ping", "formaction"],
    // A removed element keeps its text by default, so a stripped <button> would leave
    // a stray "Submit" on the page. Drop the content of controls and embeds too; a
    // <form> is left out on purpose - some templates wrap the whole layout in one.
    ADD_FORBID_CONTENTS: ["button", "select", "textarea", "option", "object", "embed"],
  }) as HTMLElement;

export type DecodedHtml = {
  text: string;
  /**
   * Whether a save has to start with a UTF-8 byte order mark to be read back the same
   * way. A save always writes UTF-8, so a page that had a BOM, or that declares another
   * charset in its `<meta>`, needs one: a BOM outranks the declaration in a browser.
   */
  bom: boolean;
  /**
   * Every byte decoded to a character. When some did not - a page in windows-1251 with
   * no `<meta>` saying so - the text holds U+FFFD in their place, and writing it back
   * would lose them: such a file is shown, never saved.
   */
  exact: boolean;
};

const encodingOf = (label: string): string => {
  try {
    return new TextDecoder(label).encoding;
  } catch {
    return "utf-8"; // a label TextDecoder does not know
  }
};

/**
 * Decodes the file the way a browser would: a byte order mark first, then a charset
 * declared in a `<meta>` - older templates are often windows-1251 - and UTF-8 otherwise.
 */
export function decodeHtml(bytes: ArrayBuffer): DecodedHtml {
  const [b0, b1, b2] = new Uint8Array(bytes.slice(0, 3));
  let encoding: string;
  let bom = true;
  // TextDecoder drops the BOM itself.
  if (b0 === 0xef && b1 === 0xbb && b2 === 0xbf) encoding = "utf-8";
  else if (b0 === 0xff && b1 === 0xfe) encoding = "utf-16le";
  else if (b0 === 0xfe && b1 === 0xff) encoding = "utf-16be";
  else {
    const head = new TextDecoder().decode(bytes.slice(0, 1024));
    encoding = encodingOf(/<meta[^>]+charset\s*=\s*["']?\s*([\w-]+)/i.exec(head)?.[1] ?? "utf-8");
    // Bytes without a BOM are not UTF-16 whatever the page declares - "unicode" and
    // "ucs-2" included, which TextDecoder maps there: browsers read them as UTF-8.
    if (encoding.startsWith("utf-16")) encoding = "utf-8";
    bom = encoding !== "utf-8";
  }
  try {
    return { text: new TextDecoder(encoding, { fatal: true }).decode(bytes), bom, exact: true };
  } catch {
    return { text: new TextDecoder(encoding).decode(bytes), bom, exact: false };
  }
}
