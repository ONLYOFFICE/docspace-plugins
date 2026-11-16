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

import { useEffect, useState, type ReactNode } from "react";
import { useCurrentFile, usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";
import { Loader, LoaderTypes, Text, useTheme } from "@onlyoffice/apps-ui-kit";

import { confirmClose } from "../file/confirm";
import { discardAll, whenCloseRefused } from "../file/edits";
import { useHtmlFile } from "../file/useHtmlFile";
import { i18n } from "../locales";
import type { Device } from "../preview/devices";
import { PageView, type View } from "./PageView";
import { Pager } from "./Pager";
import { StateMessage } from "./StateMessage";
import { useChromeless } from "./useChromeless";
import styles from "./viewer.module.css";

// The kit's own chain for the accent: the portal's variable, the colour scheme's, the default.
const accent = "var(--accent-main, var(--color-scheme-main-accent, #4781d1))";

/** The media viewer's content for an .html or .htm file: the file on screen, read and shown. */
export function HtmlPreview() {
  const file = useCurrentFile();
  const [state, reload] = useHtmlFile(file?.id);
  const { isBase } = useTheme();
  const actions = usePluginActions();
  const chromeless = useChromeless();
  // Held here rather than per page, so the chosen view and width survive paging.
  const [view, setView] = useState<View>("preview");
  const [device, setDevice] = useState<Device>("desktop");

  useEffect(
    () =>
      whenCloseRefused(() =>
        confirmClose(actions, () => {
          discardAll();
          actions.closeMediaViewer();
        }),
      ),
    [actions],
  );

  let content: ReactNode;
  switch (state.status) {
    case "loading":
      content = (
        <StateMessage>
          <Loader
            type={LoaderTypes.oval}
            size="40px"
            color={accent}
            label={i18n.t("state.loading")}
          />
        </StateMessage>
      );
      break;
    case "empty":
      content = (
        <StateMessage>
          <Text fontSize="14px">{i18n.t("state.empty")}</Text>
        </StateMessage>
      );
      break;
    case "error":
      content = (
        <StateMessage>
          <Text fontSize="14px">
            {i18n.t(state.kind === "noFile" ? "state.noFile" : "state.loadFailed")}
          </Text>
        </StateMessage>
      );
      break;
    case "ready":
      content = (
        <PageView
          key={String(state.fileId)}
          file={state}
          reload={reload}
          view={view}
          device={device}
          onView={setView}
          onDevice={setDevice}
        />
      );
      break;
  }

  return (
    <div
      id="html-viewer-root"
      className={styles.root}
      data-theme={isBase ? "light" : "dark"}
      data-chromeless={chromeless || undefined}
    >
      <div className={styles.card}>
        {content}
        {chromeless && <Pager title={file?.title} />}
      </div>
    </div>
  );
}
