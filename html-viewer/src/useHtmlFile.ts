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
import { isPluginApiError, usePluginAPI } from "@onlyoffice/docspace-plugin-sdk/react";

import { decodeHtml } from "./html/document";

export type HtmlFileState =
  | { status: "loading" }
  | { status: "ready"; fileId: number | string; source: string }
  | { status: "empty" }
  | { status: "error"; kind: "noFile" | "load" };

/**
 * Loads the file on screen as text. The media viewer re-renders the component as the
 * user pages, so everything is keyed on the file id; an in-flight request for the
 * previous file is aborted rather than allowed to land on the wrong page.
 */
export function useHtmlFile(fileId: number | string | null | undefined): HtmlFileState {
  const api = usePluginAPI();
  const [state, setState] = useState<HtmlFileState>({ status: "loading" });

  useEffect(() => {
    if (fileId === null || fileId === undefined) {
      setState({ status: "error", kind: "noFile" });
      return;
    }

    setState({ status: "loading" });
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const file = await api.get<{ viewUrl: string }>(`/files/file/${fileId}`, undefined, {
          signal,
        });
        // viewUrl may be a pre-signed storage link on another origin: no credentials, deliberately.
        const response = await fetch(file.viewUrl, { signal });
        // A record whose bytes were never written - an empty file, not a failure.
        if (response.status === 404) return setState({ status: "empty" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const source = decodeHtml(await response.arrayBuffer());
        setState(source.trim() ? { status: "ready", fileId, source } : { status: "empty" });
      } catch (e) {
        if (signal.aborted || (isPluginApiError(e) && e.code === "ABORTED")) return;
        setState({ status: "error", kind: "load" });
      }
    })();

    return () => controller.abort();
  }, [api, fileId]);

  return state;
}
