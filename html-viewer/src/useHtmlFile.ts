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

import { useEffect, useRef, useState } from "react";
import { isPluginApiError, usePluginAPI } from "@onlyoffice/docspace-plugin-sdk/react";

import { decodeHtml } from "./html/document";

export type HtmlFile = {
  fileId: number | string;
  title: string;
  /** The text, its line breaks as "\n" whatever the file uses: see `eol`. */
  source: string;
  /** The file's version when it was read, for telling whether someone saved since. */
  version: number;
  /** A save has to start with a UTF-8 byte order mark - see decodeHtml. */
  bom: boolean;
  /** The line break the file uses, put back on save. */
  eol: string;
  /** The user may write the file, and its text was decoded without loss. */
  canEdit: boolean;
};

export type HtmlFileState =
  | ({ status: "ready" } & HtmlFile)
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; kind: "noFile" | "load" };

type FileInfo = {
  viewUrl: string;
  title: string;
  version: number;
  security?: { Edit?: boolean };
};

/**
 * Loads the file on screen as text. The media viewer re-renders the component as the
 * user pages, so everything is keyed on the file id; an in-flight request for the
 * previous file is aborted rather than allowed to land on the wrong page. The second
 * value reads the file again.
 */
export function useHtmlFile(
  fileId: number | string | null | undefined,
): [HtmlFileState, () => void] {
  const api = usePluginAPI();
  const [state, setState] = useState<HtmlFileState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  // The load the state belongs to. When the viewer keeps itself open on a close that
  // onClose refused, the current file goes null and comes straight back: neither step
  // is a new file, and reloading on them would flash a loader over the editor.
  const shown = useRef<string | null>(null);
  // Cancelled when the file changes, not when the effect re-runs: see the null case.
  const loading = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      loading.current?.abort();
      shown.current = null; // a remount (StrictMode does one) loads again
    },
    [],
  );

  useEffect(() => {
    if (fileId === null || fileId === undefined) {
      if (shown.current === null) setState({ status: "error", kind: "noFile" });
      return;
    }
    const key = `${fileId}#${attempt}`;
    if (key === shown.current) return;
    shown.current = key;

    setState({ status: "loading" });
    loading.current?.abort();
    const controller = new AbortController();
    loading.current = controller;
    const { signal } = controller;

    (async () => {
      try {
        const file = await api.get<FileInfo>(`/files/file/${fileId}`, undefined, { signal });
        // viewUrl may be a pre-signed storage link on another origin: no credentials, deliberately.
        const response = await fetch(file.viewUrl, { signal });
        // A record whose bytes were never written - an empty file, not a failure.
        if (response.status === 404) return setState({ status: "empty" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { text, bom, exact } = decodeHtml(await response.arrayBuffer());
        if (!text.trim()) return setState({ status: "empty" });
        // A textarea turns every line break into "\n": edited that way, written back as found.
        const eol = text.includes("\r\n") ? "\r\n" : text.includes("\r") ? "\r" : "\n";
        setState({
          status: "ready",
          fileId,
          title: file.title,
          source: text.replace(/\r\n?/g, "\n"),
          version: file.version,
          bom,
          eol,
          canEdit: !!file.security?.Edit && exact,
        });
      } catch (e) {
        if (signal.aborted || (isPluginApiError(e) && e.code === "ABORTED")) return;
        setState({ status: "error", kind: "load" });
      }
    })();
  }, [api, fileId, attempt]);

  return [state, () => setAttempt((n) => n + 1)];
}
