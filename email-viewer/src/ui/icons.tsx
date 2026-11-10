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

// 16px glyphs drawn in currentColor, so the surrounding style decides their colour.

export const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.87 1.5a1 1 0 0 0-1.74 0L.63 13a1 1 0 0 0 .87 1.5h13a1 1 0 0 0 .87-1.5L8.87 1.5ZM7.25 5.5h1.5v4.5h-1.5v-4.5Zm0 5.5h1.5v1.5h-1.5V11Z"
    />
  </svg>
);

export const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" />
    <circle cx="5.5" cy="6" r="1.25" fill="currentColor" />
    <path d="m2 12.5 3.5-3.5 2.5 2.5 2.5-3 3.5 4" stroke="currentColor" strokeLinejoin="round" />
  </svg>
);

export const PaperclipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
    <path
      d="M10.5 4.5 5.4 9.6a1.5 1.5 0 0 0 2.1 2.1l5.3-5.3a3 3 0 0 0-4.2-4.2L3.3 7.5a4.5 4.5 0 0 0 6.4 6.4L14 9.6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
    <path
      d="M14 8H2.5M7 3 2 8l5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Points left; the next-message button mirrors it with CSS. */
export const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
    <path
      d="M10 3 5 8l5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
