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

import { parseEmail } from "./email/parse";
import type { ParsedEmail } from "./email/types";

export type TFileInfo = {
  id: number | string;
  title: string;
  fileExst?: string;
  folderId: number | string;
  viewUrl: string;
};

export type EmailState =
  | { status: "loading" }
  | { status: "ready"; email: ParsedEmail; file: TFileInfo }
  | { status: "empty"; file: TFileInfo }
  | { status: "error"; kind: "noFile" | "load" | "parse" };

/**
 * Loads and parses the file on screen. The media viewer re-renders the component as
 * the user pages, so everything is keyed on the file id; an in-flight request for the
 * previous file is aborted rather than allowed to land on the wrong message.
 */
export function useEmail(fileId: number | string | null | undefined): EmailState {
  const api = usePluginAPI();
  const [state, setState] = useState<EmailState>({ status: "loading" });

  useEffect(() => {
    if (fileId === null || fileId === undefined) {
      setState({ status: "error", kind: "noFile" });
      return;
    }

    setState({ status: "loading" });
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      let file: TFileInfo;
      let bytes: ArrayBuffer;
      try {
        file = await api.get<TFileInfo>(`/files/file/${fileId}`, undefined, { signal });
        // viewUrl may be a pre-signed storage link on another origin: no credentials, deliberately.
        const response = await fetch(file.viewUrl, { signal });
        if (response.status === 404) {
          // A record whose bytes were never written - an empty document, not a failure.
          setState({ status: "empty", file });
          return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        bytes = await response.arrayBuffer();
      } catch (e) {
        if (signal.aborted || (isPluginApiError(e) && e.code === "ABORTED")) return;
        setState({ status: "error", kind: "load" });
        return;
      }

      if (bytes.byteLength === 0) {
        setState({ status: "empty", file });
        return;
      }

      try {
        const email = await parseEmail(bytes);
        if (!signal.aborted) setState({ status: "ready", email, file });
      } catch {
        if (!signal.aborted) setState({ status: "error", kind: "parse" });
      }
    })();

    return () => controller.abort();
  }, [api, fileId]);

  return state;
}
