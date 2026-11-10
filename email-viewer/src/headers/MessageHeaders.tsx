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

import { Fragment, type ReactNode } from "react";
import { Text } from "@onlyoffice/apps-ui-kit";

import type { EmailAddress, ParsedEmail } from "../email/types";
import { i18n } from "../locales";
import { SECONDARY_TEXT } from "../ui/tokens";
import { avatarColor, initials } from "./avatar";
import styles from "./headers.module.css";

const OTHER_ROWS = ["header.to", "header.cc", "header.bcc"] as const;

/** From, To, Cc, Bcc and Date as one block, labels in a column of their own. */
export function MessageHeaders({ email, date }: { email: ParsedEmail; date: string }) {
  const sender = email.from[0];
  const lists: Record<(typeof OTHER_ROWS)[number], EmailAddress[]> = {
    "header.to": email.to,
    "header.cc": email.cc,
    "header.bcc": email.bcc,
  };

  return (
    <div className={styles.block}>
      {sender && (
        <div
          className={styles.avatar}
          style={{ background: avatarColor(sender) }}
          aria-hidden="true"
        >
          {initials(sender)}
        </div>
      )}
      <div className={styles.rows}>
        {email.from.length > 0 && (
          <HeaderRow label={i18n.t("header.from")}>
            <Addresses list={email.from} strong />
          </HeaderRow>
        )}
        {OTHER_ROWS.map(
          (key) =>
            lists[key].length > 0 && (
              <HeaderRow key={key} label={i18n.t(key)}>
                <Addresses list={lists[key]} />
              </HeaderRow>
            ),
        )}
        {date && <HeaderRow label={i18n.t("header.date")}>{date}</HeaderRow>}
      </div>
    </div>
  );
}

function HeaderRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Text fontSize="12px" color={SECONDARY_TEXT} noSelect>
        {label}
      </Text>
      <Text fontSize="13px" style={{ overflowWrap: "anywhere" }}>
        {children}
      </Text>
    </>
  );
}

/** Names first, addresses dimmed after them: the name is what the reader looks for. */
function Addresses({ list, strong = false }: { list: EmailAddress[]; strong?: boolean }) {
  return list.map((a, i) => (
    <Fragment key={`${a.address}-${i}`}>
      {i > 0 && ", "}
      <span style={{ fontWeight: strong ? 600 : undefined }}>{a.name || a.address}</span>
      {a.name && a.address && <span style={{ color: SECONDARY_TEXT }}> &lt;{a.address}&gt;</span>}
    </Fragment>
  ));
}
