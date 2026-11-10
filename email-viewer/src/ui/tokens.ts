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

// Portal theme variables the components share, so each colour has one spelling.

export const DIVIDER = "1px solid var(--border-service-color)";

/**
 * Labels, addresses, sizes. Not --text-disable-color: that is the colour of a control
 * that cannot be used, and on the dark theme it is #5c5c5c, close to unreadable.
 */
export const SECONDARY_TEXT = "var(--info-panel-members-subtitle-color)";

/** The kit's own chain for the accent: the portal's variable, the colour scheme's, the default. */
export const ACCENT = "var(--accent-main, var(--color-scheme-main-accent, #4781d1))";

export const DISABLED = "var(--text-disable-color)";
