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

/**
 * The format-independent shape both parsers produce. The viewer renders this and
 * nothing else, so a third format (mbox, a raw MIME part) is one more parser.
 */
export type EmailAddress = {
  name: string;
  address: string;
};

export type EmailAttachment = {
  /** File name to save under; parsers fall back to a generated one when the message has none. */
  name: string;
  mimeType: string;
  size: number;
  content: Uint8Array;
  /** Content-ID without the angle brackets - what an HTML body references as `cid:...`. */
  contentId: string | null;
  /** Referenced from the body (inline image); shown as an attachment only if not referenced. */
  inline: boolean;
};

export type ParsedEmail = {
  subject: string;
  from: EmailAddress[];
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  date: Date | null;
  /** Raw HTML body as it came from the message - unsanitised. */
  html: string | null;
  text: string | null;
  attachments: EmailAttachment[];
};

export const SUPPORTED_EXTENSIONS = [".eml", ".msg"] as const;
export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];

export const isSupportedExtension = (ext: string): ext is SupportedExtension =>
  (SUPPORTED_EXTENSIONS as readonly string[]).includes(ext.toLowerCase());
