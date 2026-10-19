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
 * 3. A CSP `<meta>` inside the document decides whether remote images, fonts and
 *    stylesheets may load at all - blocked by default, because a tracking pixel is a
 *    network request the reader did not ask for. `data:` URIs are always allowed.
 *
 * Unlike a message body, a template is shown whole: the attributes of `<html>` and
 * `<body>` survive (a template's background is often `bgcolor` on `<body>`), and the
 * few base rules go first in `<head>`, so any rule of the template's own wins.
 */

// Older templates wrap their CSS in "<!-- -->", which browsers skip, while DOMPurify takes
// a <style> whose text contains "<!" for an mXSS attempt and drops every rule in it.
// Unwrap it first - never into text that could close the element.
const unwrapStyle = (node: Node): void => {
  if (node.nodeName !== "STYLE" || !node.textContent) return;
  const css = node.textContent.replace(/^\s*<!--/, "").replace(/-->\s*$/, "");
  if (!css.includes("</")) node.textContent = css;
};

/** Does the page reference anything over the network - images, backgrounds, CSS url()s? */
export const hasRemoteReferences = (html: string): boolean =>
  /\b(?:src|background|poster)\s*=\s*["']?\s*https?:\/\//i.test(html) ||
  /url\(\s*["']?\s*https?:\/\//i.test(html);

const csp = (allowRemote: boolean): string => {
  const remote = allowRemote ? " https: http:" : "";
  return [
    "default-src 'none'",
    `img-src data:${remote}`,
    `style-src 'unsafe-inline'${remote}`,
    `font-src data:${remote}`,
    `media-src data:${remote}`,
  ].join("; ");
};

// Only what a bare page needs to read well. No background: the frame element is white,
// and a background here would paint over a template's `<body bgcolor>`.
const BASE_STYLE =
  "body { margin: 0; padding: 16px; font-family: Arial, sans-serif; overflow-wrap: break-word; }";

export type DocumentOptions = {
  allowRemote: boolean;
};

export function buildHtmlDocument(html: string, options: DocumentOptions): string {
  // Added per call, not at module scope: without a DOM - where the bundle is first
  // evaluated by tooling - DOMPurify is a bare factory with no addHook to call.
  DOMPurify.addHook("beforeSanitizeElements", unwrapStyle);
  let root: HTMLElement;
  try {
    root = sanitize(html);
  } finally {
    DOMPurify.removeHook("beforeSanitizeElements", unwrapStyle);
  }

  // WHOLE_DOCUMENT hands back the <html> element, with <head> and <body> in place.
  (root.querySelector("head") ?? root).insertAdjacentHTML(
    "afterbegin",
    `<meta http-equiv="Content-Security-Policy" content="${csp(options.allowRemote)}">` +
      '<base target="_blank">' +
      `<style>${BASE_STYLE}</style>`,
  );

  return `<!doctype html>\n${root.outerHTML}`;
}

const sanitize = (html: string): HTMLElement =>
  DOMPurify.sanitize(html, {
    WHOLE_DOCUMENT: true,
    RETURN_DOM: true,
    FORBID_TAGS: [
      "form",
      "input",
      "button",
      "select",
      "textarea",
      "option",
      "link",
      "meta",
      "base",
      "iframe",
      "object",
      "embed",
      "svg",
      "math",
    ],
    FORBID_ATTR: ["srcset", "ping", "formaction"],
    // A removed element keeps its text by default, so a stripped <button> would leave
    // a stray "Submit" on the page. Drop the content of controls and embeds too; a
    // <form> is left out on purpose - some templates wrap the whole layout in one.
    // Setting this replaces DOMPurify's own list, so its entries are repeated here.
    FORBID_CONTENTS: [
      ...[
        "annotation-xml",
        "audio",
        "colgroup",
        "desc",
        "foreignobject",
        "head",
        "iframe",
        "math",
        "mi",
        "mn",
        "mo",
        "ms",
        "mtext",
      ],
      ...[
        "noembed",
        "noframes",
        "noscript",
        "plaintext",
        "script",
        "style",
        "svg",
        "template",
        "thead",
        "title",
        "video",
        "xmp",
      ],
      ...["button", "select", "textarea", "option", "object", "embed"],
    ],
  }) as HTMLElement;

/**
 * Decodes the file the way a browser would for a page that declares its charset in a
 * `<meta>` - older templates are often windows-1251 - and as UTF-8 otherwise.
 */
export function decodeHtml(bytes: ArrayBuffer): string {
  const head = new TextDecoder().decode(bytes.slice(0, 1024));
  const charset = /<meta[^>]+charset\s*=\s*["']?\s*([\w-]+)/i.exec(head)?.[1];
  try {
    return new TextDecoder(charset ?? "utf-8").decode(bytes);
  } catch {
    // A label TextDecoder does not know.
    return new TextDecoder().decode(bytes);
  }
}
