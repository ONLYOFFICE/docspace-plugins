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

import type { ReactNode } from "react";

// 16px line icons drawn in currentColor, so the button around them decides the colour.
const icon = (children: ReactNode) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

export const icons = {
  eye: icon(
    <>
      <path d="M1.5 8S4 3.25 8 3.25 14.5 8 14.5 8 12 12.75 8 12.75 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
    </>,
  ),
  code: icon(<path d="M5 4.5 1.75 8 5 11.5M11 4.5 14.25 8 11 11.5M9.25 3l-2.5 10" />),
  desktop: icon(
    <>
      <rect x="1.5" y="2.25" width="13" height="9" rx="1.5" />
      <path d="M5.5 14h5M8 11.25V14" />
    </>,
  ),
  tablet: icon(
    <>
      <rect x="2.75" y="1.5" width="10.5" height="13" rx="1.5" />
      <path d="M7 12.25h2" />
    </>,
  ),
  mobile: icon(
    <>
      <rect x="4.25" y="1.5" width="7.5" height="13" rx="1.75" />
      <path d="M7.25 12.25h1.5" />
    </>,
  ),
  copy: icon(
    <>
      <rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.5" />
      <path d="M10.5 5.5v-2A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5h2" />
    </>,
  ),
  save: icon(
    <>
      <path d="M3 2.5h7.75L13.5 5.25V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z" />
      <path d="M5.25 2.5V5.5h4.5v-3M5 13.5V9.5h6v4" />
    </>,
  ),
  undo: icon(
    <>
      <path d="M3.5 6.5h6.25a3.25 3.25 0 0 1 0 6.5H7" />
      <path d="M6 3.5 3 6.5l3 3" />
    </>,
  ),
  check: icon(<path d="m3 8.5 3.25 3.25L13 5" />),
  close: icon(<path d="m4 4 8 8m0-8-8 8" />),
  previous: icon(<path d="M10 3.5 5.5 8l4.5 4.5" />),
  next: icon(<path d="M6 3.5 10.5 8 6 12.5" />),
  shield: icon(
    <path d="M8 1.75 2.75 3.5v4c0 3.25 2.25 5.75 5.25 6.75 3-1 5.25-3.5 5.25-6.75v-4L8 1.75Z" />,
  ),
};
