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

import { findCspBlockedOrigins, type CspBlock } from "./csp-probe";

/** Probes once the reader has allowed remote images; until then nothing is requested. */
export function useCspBlockedOrigins(urls: string[], enabled: boolean): CspBlock[] {
  const [blocked, setBlocked] = useState<CspBlock[]>([]);

  useEffect(() => {
    setBlocked([]);
    if (!enabled) return;
    let cancelled = false;
    findCspBlockedOrigins(urls).then((origins) => {
      if (!cancelled) setBlocked(origins);
    });
    return () => {
      cancelled = true;
    };
  }, [urls, enabled]);

  return blocked;
}
