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

import type { EmailAttachment } from "./types";
import { toBase64 } from "./format";

/**
 * Turns the HTML body of a message into a complete document for a sandboxed
 * `<iframe srcdoc>`. Three layers keep the message from reaching the portal:
 *
 * 1. DOMPurify strips scripts, event handlers, forms and anything that is not
 *    plain presentational markup.
 * 2. The iframe is sandboxed by the component (no scripts, no same-origin), so
 *    even a sanitiser miss cannot touch the portal's DOM or cookies.
 * 3. A CSP `<meta>` inside the document decides whether remote images and fonts
 *    may load at all - blocked by default, because a tracking pixel is a network
 *    request the reader did not ask for. `data:` URIs (inline images) are always allowed.
 *
 * The canvas is deliberately white with dark text whatever the portal theme: HTML
 * mail is authored against a light background, and a dark canvas turns most of it
 * into dark-on-dark. This document is a separate origin with no access to the
 * portal's theme variables, so these are the only literal colours in the plugin.
 */

/** Does the body reference anything over the network - images, backgrounds, CSS url()s? */
export const hasRemoteReferences = (html: string): boolean =>
  /\b(?:src|background|poster)\s*=\s*["']?\s*https?:\/\//i.test(html) ||
  /url\(\s*["']?\s*https?:\/\//i.test(html);

const findByContentId = (
  attachments: EmailAttachment[],
  cid: string,
): EmailAttachment | undefined => {
  const wanted = decodeURIComponent(cid).toLowerCase();
  return attachments.find((a) => a.contentId !== null && a.contentId.toLowerCase() === wanted);
};

const toDataUri = (a: EmailAttachment): string =>
  `data:${a.mimeType};base64,${toBase64(a.content)}`;

/** Replace `cid:` references on `src` and `background` attributes with inline data URIs. */
const inlineContentIds = (root: Element, attachments: EmailAttachment[]): void => {
  const attrs = ["src", "background"];
  for (const attr of attrs) {
    for (const el of Array.from(root.querySelectorAll(`[${attr}]`))) {
      const value = el.getAttribute(attr) ?? "";
      if (!/^\s*cid:/i.test(value)) continue;
      const cid = value.replace(/^\s*cid:/i, "").trim();
      const attachment = findByContentId(attachments, cid);
      if (attachment) el.setAttribute(attr, toDataUri(attachment));
      else el.removeAttribute(attr);
    }
  }
};

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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

const BASE_STYLE = `
  html, body { margin: 0; padding: 0; }
  body { padding: 16px; background: #ffffff; color: #333333; font-family: "Open Sans", Arial, sans-serif; font-size: 14px; line-height: 1.4; overflow-wrap: break-word; }
  img { max-width: 100%; height: auto; }
  blockquote { margin: 0 0 0 8px; padding-left: 8px; border-left: 2px solid #cccccc; }
  pre { white-space: pre-wrap; }
`;

export type BodyDocumentOptions = {
  allowRemote: boolean;
};

export function buildHtmlDocument(
  html: string,
  attachments: EmailAttachment[],
  options: BodyDocumentOptions,
): string {
  const sanitized = DOMPurify.sanitize(html, {
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
    // a stray "Submit" in the body. Drop the content of controls and embeds too; a
    // <form> is left out on purpose - some newsletters wrap the whole message in one.
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

  // WHOLE_DOCUMENT hands back the <html> element; styles in <head> would be lost
  // by taking body.innerHTML alone, so carry them over explicitly.
  const head = sanitized.querySelector("head");
  const body = sanitized.querySelector("body") ?? sanitized;
  inlineContentIds(sanitized, attachments);
  const headStyles = head
    ? Array.from(head.querySelectorAll("style"))
        .map((s) => s.outerHTML)
        .join("\n")
    : "";

  return [
    "<!doctype html>",
    "<html><head>",
    '<meta charset="utf-8">',
    `<meta http-equiv="Content-Security-Policy" content="${escapeHtml(csp(options.allowRemote))}">`,
    '<base target="_blank">',
    `<style>${BASE_STYLE}</style>`,
    headStyles,
    "</head><body>",
    body.innerHTML,
    "</body></html>",
  ].join("\n");
}
