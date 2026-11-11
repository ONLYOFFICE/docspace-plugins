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

import type { CSSProperties, ReactNode } from "react";

import styles from "./ui.module.css";

type Option<T> = { value: T; label: string; title?: string; icon: ReactNode };

/** A row of toggle buttons with a selected background that slides between them. */
export function Segmented<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  iconsOnly,
}: {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  iconsOnly?: boolean;
}) {
  // No arrow-key handling: while the viewer is open, Left and Right page between files.
  const index = options.findIndex((o) => o.value === value);
  return (
    <div
      id={id}
      role="group"
      aria-label={label}
      className={styles.segmented}
      style={{ "--count": options.length, "--index": index } as CSSProperties}
    >
      <span className={styles.thumb} aria-hidden />
      {options.map((o) => (
        <button
          key={o.value}
          id={`${id}-${o.value}`}
          type="button"
          className={styles.segment}
          aria-pressed={o.value === value}
          aria-label={o.label}
          title={o.title}
          onClick={() => onChange(o.value)}
        >
          {o.icon}
          {!iconsOnly && <span className={styles.label}>{o.label}</span>}
        </button>
      ))}
    </div>
  );
}
