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

import { useEffect, useState } from "react";

import { i18n } from "../locales";
import { icons } from "../ui/icons";
import ui from "../ui/ui.module.css";
import { copyText } from "./copy-text";

export function CopyButton({ source }: { source: string }) {
  const [result, setResult] = useState<"done" | "failed" | null>(null);

  // The outcome replaces the label for a moment; a toast may sit under the media viewer.
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setResult(null), 2000);
    return () => clearTimeout(timer);
  }, [result]);

  const copy = async (button: HTMLElement) => {
    try {
      await copyText(source, button.parentElement ?? document.body);
      setResult("done");
    } catch {
      setResult("failed");
    }
  };

  const label = i18n.t(result ? `copy.${result}` : "copy.label");
  return (
    <button
      id="html-viewer-copy"
      type="button"
      className={ui.action}
      data-state={result ?? undefined}
      aria-label={label}
      onClick={(e) => copy(e.currentTarget)}
    >
      {result === "done" ? icons.check : icons.copy}
      <span className={ui.label}>{label}</span>
    </button>
  );
}
