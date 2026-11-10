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

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * The portal page that shows untrusted HTML under a policy of its own (nginx serves
 * /static/html-frame/ outside the portal's CSP). A portal under a proxy path keeps
 * its static files behind that path too.
 */
const frameUrl = (): string => {
  const proxy =
    (window as { ClientConfig?: { proxy?: { url?: string } } }).ClientConfig?.proxy?.url ?? "";
  return `${proxy.replace(/\/$/, "")}/static/html-frame/html-frame.html`;
};

let availability: Promise<boolean> | undefined;

/**
 * Asked once per page load with a HEAD request. The page counts only when it comes with
 * its own policy: an older portal may answer an unknown /static/ path with its whole
 * app, and that must not be loaded into the frame.
 */
const checkAvailability = (): Promise<boolean> =>
  (availability ??= fetch(frameUrl(), {
    method: "HEAD",
    credentials: "same-origin",
    cache: "no-store",
  })
    .then((r) => r.ok && /frame-ancestors/.test(r.headers.get("content-security-policy") ?? ""))
    .catch(() => false));

/** null until known; the answer is shared by every frame on the page. */
export function useHtmlFrameAvailable(): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    checkAvailability().then((ok) => {
      if (alive) setAvailable(ok);
    });
    return () => {
      alive = false;
    };
  }, []);
  return available;
}

const SANDBOX = "allow-popups allow-popups-to-escape-sandbox";

/**
 * Shows sanitised HTML. Where the portal has the frame page, the HTML is handed to it by
 * postMessage and lives under that page's policy, so remote images, styles and fonts
 * load. Elsewhere it falls back to srcdoc, which inherits the portal's own policy.
 * Either way the content runs in a sandbox with no scripts and no access to the portal.
 */
export function HtmlFrame({
  html,
  title,
  style,
  available,
}: {
  html: string;
  title: string;
  style?: CSSProperties;
  available: boolean;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!available) return;
    const onMessage = (e: MessageEvent) => {
      if (
        e.source === ref.current?.contentWindow &&
        e.origin === window.location.origin &&
        e.data?.type === "html-frame-ready"
      )
        setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [available]);

  useEffect(() => {
    if (!ready) return;
    ref.current?.contentWindow?.postMessage(
      { type: "html-frame-content", html, title },
      window.location.origin,
    );
  }, [ready, html, title]);

  if (!available) return <iframe style={style} title={title} sandbox={SANDBOX} srcDoc={html} />;
  return <iframe ref={ref} style={style} title={title} src={frameUrl()} />;
}
