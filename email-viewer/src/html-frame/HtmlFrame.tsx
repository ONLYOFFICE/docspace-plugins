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

import { useEffect, type CSSProperties } from "react";
import { usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";

const FRAME_ID = "email-viewer-body-frame";
const SANDBOX = "allow-popups allow-popups-to-escape-sandbox";

/**
 * Shows sanitised HTML. On a portal with the html-frame page the portal takes the frame
 * over and shows the HTML there, under the page's own policy, so remote images, styles
 * and fonts load. A portal without it has no showHtmlInFrame action, and the HTML goes
 * into srcdoc, which inherits the portal's policy. Either way the content runs no script
 * and cannot reach the portal.
 */
export function HtmlFrame({
  html,
  title,
  style,
}: {
  html: string;
  title: string;
  style?: CSSProperties;
}) {
  const { showHtmlInFrame } = usePluginActions();
  const onPage = typeof showHtmlInFrame === "function";

  useEffect(() => {
    if (onPage) showHtmlInFrame({ frameId: FRAME_ID, html, title });
  }, [onPage, showHtmlInFrame, html, title]);

  if (!onPage) return <iframe style={style} title={title} sandbox={SANDBOX} srcDoc={html} />;
  return <iframe id={FRAME_ID} style={style} title={title} />;
}
