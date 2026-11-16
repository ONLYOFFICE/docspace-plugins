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

// A refused image fails at once, before any request; one that is still loading after
// this long is allowed, so there is no point in waiting for it.
const PROBE_TIMEOUT_MS = 2000;
// The violation event and the image's error event are separate tasks in no fixed order.
const EVENT_GRACE_MS = 100;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type CspBlock = {
  origin: string;
  /**
   * The policy already lists this site, so what it refused is where the site redirected
   * the image - an address the browser keeps from scripts (the console shows it).
   */
  redirected: boolean;
};

/**
 * Does the img-src of `policy` (or default-src, when there is no img-src) list `origin`?
 * Deliberately partial: it matches what an administrator adds - an exact origin, a bare
 * host or a `*.domain` wildcard - not every CSP source form (paths, ports, `https:`).
 */
export function isListedInPolicy(policy: string, origin: string): boolean {
  const directives = policy.split(";").map((d) => d.trim().split(/\s+/));
  const sources =
    directives.find(([name]) => name === "img-src") ??
    directives.find(([name]) => name === "default-src");
  if (!sources) return false;
  const { protocol, hostname, port } = new URL(origin);
  const effectivePort = port || (protocol === "https:" ? "443" : "80");
  return sources.slice(1).some((source) => {
    const [, scheme, wildcard, sourceHost, sourcePort] =
      source.toLowerCase().match(/^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*\.)?([^/:]+)(?::(\d+|\*))?/) ??
      [];
    if (!sourceHost || (scheme && `${scheme}:` !== protocol)) return false;
    // A source without a port allows only the scheme's default one.
    if (
      sourcePort !== "*" &&
      (sourcePort ?? (protocol === "https:" ? "443" : "80")) !== effectivePort
    )
      return false;
    return wildcard ? hostname.endsWith(`.${sourceHost}`) : hostname === sourceHost;
  });
}

/**
 * The sites, as origins, whose images the portal's Content Security Policy refuses.
 *
 * The message frame is sandboxed and runs no script, so it cannot tell what failed.
 * It inherits the portal page's policy, though, so one probe image per site, loaded
 * from the portal page, meets the same img-src rule. Only a refusal by an enforced
 * policy counts: a missing file, a 403 from the site, a DNS failure or an ad blocker
 * raises no `securitypolicyviolation` and leaves the site off the list.
 *
 * Known limit: a site that redirects its images is reported under its own origin
 * (the browser hides where a redirect went), even when the policy refused the target.
 */
export function findCspBlockedOrigins(urls: string[]): Promise<CspBlock[]> {
  const probeUrls = new Map<string, string>();
  for (const url of urls) {
    try {
      const { origin } = new URL(url);
      if (!probeUrls.has(origin)) probeUrls.set(origin, url);
    } catch {
      // not a URL the browser would load either
    }
  }
  if (probeUrls.size === 0) return Promise.resolve([]);

  const refused = new Map<string, CspBlock>();
  const onViolation = (e: SecurityPolicyViolationEvent) => {
    // A report-only policy raises the event too but blocks nothing. Anything else on
    // the page that breaks the policy meanwhile is not one of the probed sites.
    if (e.disposition !== "enforce" || e.effectiveDirective !== "img-src") return;
    try {
      const { origin } = new URL(e.blockedURI);
      if (probeUrls.has(origin))
        refused.set(origin, { origin, redirected: isListedInPolicy(e.originalPolicy, origin) });
    } catch {
      // "inline", "data" and the like: not a site an administrator can add
    }
  };
  document.addEventListener("securitypolicyviolation", onViolation);

  const probes = [...probeUrls.values()].map(
    (url) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.referrerPolicy = "no-referrer";
        img.onload = img.onerror = () => resolve();
        img.src = url;
      }),
  );

  return Promise.race([Promise.all(probes), wait(PROBE_TIMEOUT_MS)])
    .then(() => wait(EVENT_GRACE_MS))
    .then(() => {
      document.removeEventListener("securitypolicyviolation", onViolation);
      return [...refused.values()];
    });
}
