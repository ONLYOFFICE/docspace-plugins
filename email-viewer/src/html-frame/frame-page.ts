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

/**
 * The portal page that shows untrusted HTML under a policy of its own (nginx serves
 * /static/html-frame/ outside the portal's CSP). A portal under a proxy path keeps
 * its static files behind that path too.
 */
export const frameUrl = (): string => {
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
export const checkFramePage = (): Promise<boolean> =>
  (availability ??= fetch(frameUrl(), {
    method: "HEAD",
    credentials: "same-origin",
    cache: "no-store",
  })
    .then((r) => r.ok && /frame-ancestors/.test(r.headers.get("content-security-policy") ?? ""))
    .catch(() => false));
