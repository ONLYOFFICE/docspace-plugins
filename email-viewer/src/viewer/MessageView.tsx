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

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useCurrentUser } from "@onlyoffice/docspace-plugin-sdk/react";
import { Heading, HeadingLevel, HeadingSize } from "@onlyoffice/apps-ui-kit";

import { Attachments } from "../attachments/Attachments";
import { buildHtmlDocument, remoteUrls } from "../email/body-document";
import { formatDate } from "../email/format";
import { linkify } from "../email/linkify";
import type { ParsedEmail } from "../email/types";
import { MessageHeaders } from "../headers/MessageHeaders";
import { HtmlFrame } from "../html-frame/HtmlFrame";
import { useHtmlFrameAvailable } from "../html-frame/useHtmlFrameAvailable";
import { i18n } from "../locales";
import { RemoteImagesNotice } from "../remote-images/RemoteImagesNotice";
import { useCspBlockedOrigins } from "../remote-images/useCspBlockedOrigins";
import { StateMessage } from "./StateMessage";
import styles from "./viewer.module.css";

const frameStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  border: 0,
  background: "#ffffff", // the message canvas; see body-document.ts for why it is not themed
};

/** One parsed message: headers, attachments, the remote-images bar and the body. */
export function MessageView({
  email,
  fileId,
  folderId,
}: {
  email: ParsedEmail;
  fileId: number | string;
  folderId: number | string;
}) {
  const [allowRemote, setAllowRemote] = useState(false);
  const user = useCurrentUser();
  const isAdmin = Boolean(user?.isAdmin || user?.isOwner);

  const visibleAttachments = useMemo(() => email.attachments.filter((a) => !a.inline), [email]);

  // Read off the sanitised body: a script or frame the sanitiser removed is neither
  // announced nor probed.
  const remote = useMemo(() => {
    if (!email.html) return [];
    try {
      return remoteUrls(buildHtmlDocument(email.html, email.attachments, { allowRemote: false }));
    } catch {
      return [];
    }
  }, [email]);

  const frameAvailable = useHtmlFrameAvailable();
  // On the portal's frame page the portal's policy does not reach the message, so there
  // is nothing to probe; the probe is the fallback's way to explain missing images.
  const blocked = useCspBlockedOrigins(remote, allowRemote && frameAvailable === false);

  const [srcDoc, setSrcDoc] = useState<string | null>(null);
  useEffect(() => {
    if (!email.html) {
      setSrcDoc(null);
      return;
    }
    try {
      setSrcDoc(buildHtmlDocument(email.html, email.attachments, { allowRemote }));
    } catch {
      setSrcDoc(null);
    }
  }, [email, allowRemote]);

  const textBody = email.text ?? "";

  return (
    <>
      <header className={styles.header}>
        <Heading
          level={HeadingLevel.h2}
          size={HeadingSize.medium}
          truncate
          title={email.subject}
          style={{ margin: 0 }}
        >
          {email.subject || i18n.t("subject.empty")}
        </Heading>
        <MessageHeaders email={email} date={formatDate(email.date, i18n.locale)} />
      </header>

      <Attachments attachments={visibleAttachments} fileId={fileId} folderId={folderId} />

      {remote.length > 0 && (
        <RemoteImagesNotice
          allowRemote={allowRemote}
          blocked={blocked}
          isAdmin={isAdmin}
          onToggle={() => setAllowRemote((v) => !v)}
        />
      )}

      <div className={styles.body}>
        {email.html && srcDoc !== null ? (
          frameAvailable !== null && (
            <HtmlFrame
              html={srcDoc}
              title={i18n.t("body.title")}
              style={frameStyle}
              available={frameAvailable}
            />
          )
        ) : textBody.trim() ? (
          <pre className={styles.text}>{linkify(textBody)}</pre>
        ) : (
          <StateMessage text={i18n.t("body.empty")} />
        )}
      </div>
    </>
  );
}
