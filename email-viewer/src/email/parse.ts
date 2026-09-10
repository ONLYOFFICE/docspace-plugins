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

import { parseEml } from "./parse-eml";
import { parseMsg } from "./parse-msg";
import type { ParsedEmail } from "./types";

const OLE_MAGIC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

const isCompoundFile = (bytes: ArrayBuffer): boolean => {
  if (bytes.byteLength < OLE_MAGIC.length) return false;
  const head = new Uint8Array(bytes, 0, OLE_MAGIC.length);
  return OLE_MAGIC.every((b, i) => head[i] === b);
};

/**
 * Dispatch on the bytes, not the extension: an Outlook item is an OLE compound file
 * whatever it is called, and a `.msg` without that signature is almost always a MIME
 * message saved under the wrong name - postal-mime reads it fine.
 */
export async function parseEmail(bytes: ArrayBuffer): Promise<ParsedEmail> {
  if (isCompoundFile(bytes)) return parseMsg(bytes);
  return parseEml(bytes);
}
