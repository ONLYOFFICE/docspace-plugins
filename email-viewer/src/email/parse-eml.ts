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

import PostalMime, { type Address, type Attachment } from "postal-mime";

import type { EmailAddress, EmailAttachment, ParsedEmail } from "./types";
import { safeFileName } from "./format";

/** postal-mime returns groups (`undisclosed-recipients: ;`) as nested lists; flatten them. */
const flattenAddresses = (list: Address[] | Address | undefined): EmailAddress[] => {
  if (!list) return [];
  const items = Array.isArray(list) ? list : [list];
  const out: EmailAddress[] = [];
  for (const item of items) {
    if (item.group) {
      for (const member of item.group)
        out.push({ name: member.name ?? "", address: member.address ?? "" });
    } else {
      out.push({ name: item.name ?? "", address: item.address ?? "" });
    }
  }
  return out;
};

const toBytes = (content: Attachment["content"]): Uint8Array => {
  if (typeof content === "string") return new TextEncoder().encode(content);
  if (content instanceof Uint8Array) return content;
  return new Uint8Array(content);
};

const stripBrackets = (id: string | undefined): string | null => {
  if (!id) return null;
  const trimmed = id.trim().replace(/^<|>$/g, "");
  return trimmed || null;
};

const referencedContentIds = (html: string | null): Set<string> => {
  const ids = new Set<string>();
  if (!html) return ids;
  const re = /cid:([^"'\s)>]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) ids.add(decodeURIComponent(match[1]).toLowerCase());
  return ids;
};

export async function parseEml(bytes: ArrayBuffer): Promise<ParsedEmail> {
  const email = await PostalMime.parse(bytes, { attachmentEncoding: "arraybuffer" });
  const html = email.html ?? null;
  const referenced = referencedContentIds(html);

  const attachments: EmailAttachment[] = email.attachments.map((a, index) => {
    const content = toBytes(a.content);
    const contentId = stripBrackets(a.contentId);
    const inline = contentId !== null && referenced.has(contentId.toLowerCase());
    return {
      name: safeFileName(a.filename ?? "", `attachment-${index + 1}`),
      mimeType: a.mimeType || "application/octet-stream",
      size: content.byteLength,
      content,
      contentId,
      inline,
    };
  });

  const date = email.date ? new Date(email.date) : null;

  return {
    subject: email.subject?.trim() ?? "",
    from: flattenAddresses(email.from),
    to: flattenAddresses(email.to),
    cc: flattenAddresses(email.cc),
    bcc: flattenAddresses(email.bcc),
    date: date && !Number.isNaN(date.getTime()) ? date : null,
    html,
    text: email.text ?? null,
    attachments,
  };
}
