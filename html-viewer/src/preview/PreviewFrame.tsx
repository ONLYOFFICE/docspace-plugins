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

import { useEffect } from "react";
import { usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";

import type { PreviewDocument } from "../html/document";
import { i18n } from "../locales";
import { icons } from "../ui/icons";
import type { DeviceSize } from "./devices";
import styles from "./preview.module.css";

const FRAME_ID = "html-viewer-frame";

/**
 * The page as a browser draws it, at the chosen width. A portal with the html-frame page
 * takes the frame over and shows the page there, under the page's own policy, so a
 * template's images, styles and fonts load from any site. A portal without it has no
 * such action: the page goes into srcdoc and lives under the portal's policy, and a note
 * says that images of other sites depend on it.
 */
export function PreviewFrame({ built, size }: { built: PreviewDocument; size: DeviceSize }) {
  const { showHtmlInFrame } = usePluginActions();
  const onPage = typeof showHtmlInFrame === "function";
  const title = i18n.t("body.title");

  useEffect(() => {
    if (onPage) showHtmlInFrame({ frameId: FRAME_ID, html: built.html, title });
  }, [onPage, showHtmlInFrame, built, title]);

  return (
    <>
      {built.remote && !onPage && (
        <div id="html-viewer-remote" className={styles.notice}>
          {icons.shield}
          <span>{i18n.t("images.blocked")}</span>
        </div>
      )}
      <div
        className={styles.stage}
        data-device={size.value}
        data-framed={size.width ? "" : undefined}
      >
        <div className={styles.device} style={{ width: size.width, height: size.height }}>
          <iframe
            id={FRAME_ID}
            title={title}
            sandbox={onPage ? undefined : "allow-popups allow-popups-to-escape-sandbox"}
            srcDoc={onPage ? undefined : built.html}
          />
        </div>
      </div>
    </>
  );
}
