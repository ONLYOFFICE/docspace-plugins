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
 * The form two Content-IDs are compared in: percent-decoded, as a `cid:` URL carries one
 * (RFC 2392), and lower-cased. A malformed escape such as `cid:%zz` is compared as written:
 * decodeURIComponent would throw, and one bad reference would fail the whole message.
 */
export const contentIdKey = (raw: string): string => {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // Not valid percent-encoding: keep the reference as it is.
  }
  return decoded.toLowerCase();
};
