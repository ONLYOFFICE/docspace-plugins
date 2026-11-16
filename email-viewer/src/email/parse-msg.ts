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

import MsgReader, { type FieldsData } from "@kenjiuno/msgreader";

import type { EmailAddress, EmailAttachment, ParsedEmail } from "./types";
import { decodeBytes, safeFileName } from "./format";

const recipientAddress = (r: FieldsData): EmailAddress => ({
  name: r.name ?? "",
  address: r.smtpAddress ?? r.email ?? "",
});

const senderAddress = (m: FieldsData): EmailAddress[] => {
  const address = m.senderSmtpAddress ?? m.sentRepresentingSmtpAddress ?? m.senderEmail ?? "";
  const name = m.senderName ?? "";
  if (!address && !name) return [];
  return [{ name, address }];
};

const parseDate = (value: string | undefined): Date | null => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Outlook stores the HTML body either decoded (`bodyHtml`) or as raw bytes in the
 * message code page (`html`). RTF-only messages (`compressedRtf` without either)
 * fall back to the plain-text body - de-encapsulating HTML from RTF is not done here.
 */
const htmlBody = (m: FieldsData): string | null => {
  if (m.bodyHtml && m.bodyHtml.trim()) return m.bodyHtml;
  if (m.html && m.html.byteLength > 0)
    return decodeBytes(m.html, m.internetCodepage ?? m.messageCodepage);
  return null;
};

export function parseMsg(bytes: ArrayBuffer): ParsedEmail {
  const reader = new MsgReader(bytes);
  const msg = reader.getFileData();
  if (msg.error) throw new Error(msg.error);

  const recipients = msg.recipients ?? [];

  // msgreader answers a damaged or foreign compound file with an object of undefined
  // fields rather than an error. Every real Outlook item carries a message class
  // (IPM.Note, IPM.Appointment, ...); nothing at all means this is not a message.
  const hasAnything =
    msg.messageClass ||
    msg.subject ||
    msg.body ||
    msg.bodyHtml ||
    msg.html ||
    recipients.length > 0 ||
    (msg.attachments?.length ?? 0) > 0;
  if (!hasAnything) throw new Error("Not an Outlook message");
  const byType = (type: FieldsData["recipType"]) =>
    recipients.filter((r) => (r.recipType ?? "to") === type).map(recipientAddress);

  const html = htmlBody(msg);
  const lowerHtml = html?.toLowerCase() ?? "";

  const attachments: EmailAttachment[] = (msg.attachments ?? []).map((a, index) => {
    let content: Uint8Array;
    let name = a.fileName ?? a.fileNameShort ?? "";
    try {
      const data = reader.getAttachment(a);
      content = data.content;
      if (!name && data.fileName) name = data.fileName;
    } catch {
      content = new Uint8Array(0);
    }
    if (a.innerMsgContent && !/\.msg$/i.test(name)) {
      name = `${name || a.innerMsgContentFields?.subject || `message-${index + 1}`}.msg`;
    }
    const contentId = a.pidContentId?.trim().replace(/^<|>$/g, "") || null;
    const inline =
      (contentId !== null && lowerHtml.includes(`cid:${contentId.toLowerCase()}`)) ||
      a.attachmentHidden === true;
    return {
      name: safeFileName(name, `attachment-${index + 1}`),
      mimeType:
        a.attachMimeTag ||
        (a.innerMsgContent ? "application/vnd.ms-outlook" : "application/octet-stream"),
      size: content.byteLength,
      content,
      contentId,
      inline,
    };
  });

  return {
    subject: (msg.subject ?? msg.normalizedSubject ?? "").trim(),
    from: senderAddress(msg),
    to: byType("to"),
    cc: byType("cc"),
    bcc: byType("bcc"),
    date:
      parseDate(msg.messageDeliveryTime) ??
      parseDate(msg.clientSubmitTime) ??
      parseDate(msg.creationTime),
    html,
    text: msg.body ?? null,
    attachments,
  };
}
