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

import { useSyncExternalStore } from "react";
import type { usePluginAPI } from "@onlyoffice/docspace-plugin-sdk/react";

import type { HtmlFile } from "./useHtmlFile";

type Api = ReturnType<typeof usePluginAPI>;

/** The editor's state for one file. */
export type Edit = {
  /** The text the server holds as far as this viewer knows, line breaks as "\n". */
  saved: string;
  version: number;
  /** The user's text, while it differs from `saved`. */
  draft?: string;
  /** The version the draft was started on: a save over any other asks first. */
  base?: number;
  saving?: boolean;
  /** A save found that someone else had saved the file since the draft was started. */
  conflict?: boolean;
};

// Module scope rather than component state. The viewer can close in ways onClose never
// hears of - a second Back, the file deleted under it - which unmount the component,
// and a draft kept here is still there when the file is opened again. A save that
// outlives the page it started on lands here too, not on a component that is gone.
const edits = new Map<string, Edit>();
const listeners = new Set<() => void>();
let revision = 0;

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getRevision = (): number => revision;

/** Re-renders the caller whenever any file's edit changes. */
export const useEdits = (): number => useSyncExternalStore(subscribe, getRevision, getRevision);

export const unsavedCount = (): number =>
  [...edits.values()].filter((edit) => edit.draft !== undefined).length;

const warnOnUnload = (e: BeforeUnloadEvent) => e.preventDefault();
let warning = false;

const changed = (): void => {
  revision++;
  // Closing or reloading the tab is past onClose: while anything is unsaved, the browser asks.
  const dirty = unsavedCount() > 0;
  if (dirty !== warning) {
    if (dirty) window.addEventListener("beforeunload", warnOnUnload);
    else window.removeEventListener("beforeunload", warnOnUnload);
    warning = dirty;
  }
  listeners.forEach((listener) => listener());
};

/** The file's edit, or one made from what was just read when there is none yet. */
export const editOf = (file: HtmlFile): Edit =>
  edits.get(String(file.fileId)) ?? { saved: file.source, version: file.version };

/** Takes in a fresh read of the file, unless a save of this viewer's is newer than it. */
export function track(file: HtmlFile): void {
  const edit = edits.get(String(file.fileId));
  if (!edit || edit.version >= file.version) return;
  edit.saved = file.source;
  edit.version = file.version;
  changed();
}

/** The user's text: a draft while it differs from the file, nothing once it matches again. */
export function change(file: HtmlFile, text: string): void {
  const key = String(file.fileId);
  const edit = edits.get(key) ?? { saved: file.source, version: file.version };
  if (text === edit.saved) {
    edit.draft = edit.base = undefined;
    edit.conflict = false;
  } else {
    if (edit.draft === undefined) edit.base = edit.version;
    edit.draft = text;
  }
  edits.set(key, edit);
  changed();
}

export function discard(fileId: number | string): void {
  const edit = edits.get(String(fileId));
  if (!edit) return;
  edit.draft = edit.base = undefined;
  edit.conflict = false;
  changed();
}

export function discardAll(): void {
  for (const edit of edits.values()) {
    edit.draft = edit.base = undefined;
    edit.conflict = false;
  }
  changed();
}

export type SaveResult = "saved" | "conflict" | "failed" | "none";

/**
 * Writes the draft over the file as a new version, the way the portal's own editors do,
 * so the open file list updates too. There is nothing to write without a draft: a save
 * of unchanged text would only add a version. Unless `overwrite`, a file someone else
 * saved after the draft was started is left alone and the edit marked as a conflict.
 */
export async function save(api: Api, file: HtmlFile, overwrite = false): Promise<SaveResult> {
  const edit = edits.get(String(file.fileId));
  if (!edit || edit.draft === undefined || edit.saving) return "none";
  const text = edit.draft;
  edit.saving = true;
  changed();
  try {
    if (!overwrite) {
      // ponytail: a check, then a write - a save landing between the two is still
      // overwritten; the update endpoint takes no expected version to close that gap.
      const current = await api.get<{ version: number }>(`/files/file/${file.fileId}`);
      if (current.version !== edit.base) {
        edit.conflict = true;
        return "conflict";
      }
    }
    const lines = file.eol === "\n" ? text : text.replace(/\n/g, file.eol);
    const form = new FormData();
    form.append(
      "file",
      new File([file.bom ? `﻿${lines}` : lines], file.title, { type: "text/html" }),
    );
    const written = await api.put<{ version?: number }>(`/files/${file.fileId}/update`, form);
    edit.saved = text;
    edit.version = typeof written?.version === "number" ? written.version : edit.version + 1;
    edit.conflict = false;
    // Typing may have gone on while the request was out: what is left is a draft on the new version.
    if (edit.draft === text) edit.draft = edit.base = undefined;
    else edit.base = edit.version;
    return "saved";
  } catch {
    return "failed";
  } finally {
    edit.saving = false;
    changed();
  }
}

let onRefused: (() => void) | undefined;

/** Registers what tells the user why a close was refused; returns the unregister. */
export const whenCloseRefused = (handler: () => void): (() => void) => {
  onRefused = handler;
  return () => {
    if (onRefused === handler) onRefused = undefined;
  };
};

/** Whether the viewer may close now. When it may not, the registered handler says why. */
export const canClose = (): boolean => {
  const free = unsavedCount() === 0;
  if (!free) onRefused?.();
  return free;
};
