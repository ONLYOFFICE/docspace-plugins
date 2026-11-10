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

import { Link, LinkTarget, LinkType, Text } from "@onlyoffice/apps-ui-kit";

import { i18n } from "../locales";
import { ImageIcon, WarningIcon } from "../ui/icons";
import type { CspBlock } from "./csp-probe";
import styles from "./remote-images.module.css";

/**
 * The bar over a message that loads images from the internet. Amber while something is
 * withheld - by the reader's choice or by the portal's policy; a quiet grey once the
 * images are on screen.
 */
export function RemoteImagesNotice({
  allowRemote,
  blocked,
  isAdmin,
  onToggle,
}: {
  allowRemote: boolean;
  blocked: CspBlock[];
  isAdmin: boolean;
  onToggle: () => void;
}) {
  const warning = !allowRemote || blocked.length > 0;
  const message = !allowRemote
    ? "images.blocked"
    : blocked.length > 0
      ? "images.cspBlocked"
      : "images.shown";

  return (
    <div
      id="email-viewer-remote"
      className={`${styles.notice} ${warning ? styles.warning : styles.info}`}
    >
      <span className={styles.icon}>{warning ? <WarningIcon /> : <ImageIcon />}</span>
      <div className={styles.body}>
        <div className={styles.row}>
          <Text fontSize="12px" fontWeight={warning ? 600 : 400}>
            {i18n.t(message)}
          </Text>
          <Link type={LinkType.action} fontSize="12px" color="accent" onClick={onToggle}>
            {allowRemote ? i18n.t("images.hide") : i18n.t("images.load")}
          </Link>
        </div>
        {allowRemote && blocked.length > 0 && <BlockedSites blocked={blocked} isAdmin={isAdmin} />}
      </div>
    </div>
  );
}

function BlockedSites({ blocked, isAdmin }: { blocked: CspBlock[]; isAdmin: boolean }) {
  return (
    <>
      <div className={styles.origins}>
        {blocked.map(({ origin }) => (
          <span key={origin} className={styles.origin}>
            {origin}
          </span>
        ))}
      </div>
      {/* Only an administrator can change the policy, and allowing a site there trusts it
          with far more than images - so the hint says so, and nobody else is sent to ask. */}
      {isAdmin && (
        <>
          {/* Already allowed and redirecting elsewhere: adding it again would change
              nothing, so the administrator is told where to look instead. */}
          {blocked
            .filter((b) => b.redirected)
            .map(({ origin }) => (
              <Text key={`redirect-${origin}`} fontSize="12px">
                {i18n.t("images.cspRedirect", { site: origin })}
              </Text>
            ))}
          <div className={styles.row}>
            <Text fontSize="12px">{i18n.t("images.cspAdmin")}</Text>
            <Link
              type={LinkType.page}
              href={`${window.location.origin}/developer-tools/javascript-sdk`}
              target={LinkTarget.blank}
              fontSize="12px"
              color="accent"
            >
              {i18n.t("images.cspOpenSettings")}
            </Link>
          </div>
        </>
      )}
    </>
  );
}
