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

import { i18n } from "../locales";
import { icons } from "../ui/icons";
import ui from "../ui/ui.module.css";

export type SaveState = "saving" | "done" | "failed" | null;

export function SaveButton({ state, onClick }: { state: SaveState; onClick: () => void }) {
  const label = i18n.t(
    state === "saving"
      ? "edit.saving"
      : state === "done"
        ? "edit.saved"
        : state === "failed"
          ? "edit.saveFailed"
          : "edit.save",
  );
  return (
    <button
      id="html-viewer-save"
      type="button"
      className={`${ui.action} ${ui.primary}`}
      data-state={state ?? undefined}
      aria-label={label}
      title={state ? undefined : `${label} (Ctrl+S)`}
      disabled={state === "saving"}
      onClick={onClick}
    >
      {state === "done" ? icons.check : icons.save}
      <span className={ui.label}>{label}</span>
    </button>
  );
}
