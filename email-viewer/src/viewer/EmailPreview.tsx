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

import { useRef, type ReactNode } from "react";
import { useCurrentFile } from "@onlyoffice/docspace-plugin-sdk/react";

import { i18n } from "../locales";
import { MessageView } from "./MessageView";
import { StateLoading, StateMessage } from "./StateMessage";
import { useEmail, type EmailState } from "./useEmail";
import { useStopViewerSwipe } from "./useStopViewerSwipe";
import styles from "./viewer.module.css";

/** The media viewer's content for an .eml or .msg file: the file on screen, loaded and parsed. */
export function EmailPreview() {
  const file = useCurrentFile();
  const state = useEmail(file?.id);
  const rootRef = useRef<HTMLDivElement>(null);
  useStopViewerSwipe(rootRef);

  return (
    <div
      id="email-viewer-root"
      ref={rootRef}
      className={styles.root}
      // The viewer takes the arrows, Esc and Delete on document; keep them for the message.
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className={styles.card}>{renderState(state)}</div>
    </div>
  );
}

function renderState(state: EmailState): ReactNode {
  switch (state.status) {
    case "loading":
      return <StateLoading label={i18n.t("state.loading")} />;
    case "empty":
      return <StateMessage text={i18n.t("state.empty")} />;
    case "error":
      return <StateMessage text={i18n.t(ERROR_TEXT[state.kind])} />;
    case "ready":
      return (
        <MessageView
          key={String(state.file.id)}
          email={state.email}
          fileId={state.file.id}
          folderId={state.file.folderId}
        />
      );
  }
}

const ERROR_TEXT = {
  noFile: "state.noFile",
  load: "state.loadFailed",
  parse: "state.parseFailed",
} as const;
