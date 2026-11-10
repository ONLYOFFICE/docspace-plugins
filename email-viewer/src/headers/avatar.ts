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

import type { EmailAddress } from "../email/types";

// Mid-tone colours that carry white initials in both themes.
const AVATAR_COLORS = [
  "#4781d1",
  "#2db482",
  "#f2994a",
  "#9b51e0",
  "#eb5757",
  "#219fb3",
  "#c2185b",
  "#6d9f2f",
];

/** The same address always gets the same colour, so a sender is recognised at a glance. */
export const avatarColor = ({ name, address }: EmailAddress): string => {
  let hash = 0;
  for (const ch of (address || name).toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

/** Up to two letters: the first of each name word, or of the address before the "@". */
export const initials = ({ name, address }: EmailAddress): string => {
  const words = (name || address.split("@")[0]).split(/[\s._-]+/).filter(Boolean);
  return (
    words
      .slice(0, 2)
      .map((w) => [...w][0])
      .join("")
      .toUpperCase() || "?"
  );
};
