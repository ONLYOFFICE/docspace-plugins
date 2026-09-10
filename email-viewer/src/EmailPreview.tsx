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

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useCurrentFile } from "@onlyoffice/docspace-plugin-sdk/react";
import {
  Button,
  ButtonSize,
  Heading,
  HeadingLevel,
  HeadingSize,
  Link,
  LinkType,
  Loader,
  LoaderTypes,
  Text,
} from "@docspace/ui-kit";

import { buildHtmlDocument, hasRemoteReferences } from "./email/body-document";
import { formatAddressList, formatDate, formatSize } from "./email/format";
import { linkify } from "./email/linkify";
import type { EmailAttachment, ParsedEmail } from "./email/types";
import { currentLocale, t, tf } from "./locales";
import { useEmail } from "./useEmail";
import { useSaveAttachments } from "./useSaveAttachments";
import styles from "./EmailPreview.module.css";

// The media viewer draws a 64px header band over the top of the content box and,
// with more than one file in the playlist, 73px paging strips down both sides.
// Anything under them cannot be clicked, so the surface keeps out of their way.
const rootStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  padding: "64px 73px 16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
};

const cardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 960,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  background: "var(--background-color)",
  color: "var(--text-color)",
  borderRadius: 6,
  overflow: "hidden",
};

const centered: CSSProperties = {
  flex: "1 1 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  textAlign: "center",
};

const divider = "1px solid var(--border-service-color)";

// The kit's own chain for the accent: the portal's variable, the colour scheme's, the default.
const accent = "var(--accent-main, var(--color-scheme-main-accent, #4781d1))";

const frameStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  border: 0,
  background: "#ffffff", // the message canvas; see body-document.ts for why it is not themed
};

const textStyle: CSSProperties = {
  margin: 0,
  padding: 16,
  height: "100%",
  boxSizing: "border-box",
  overflow: "auto",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
  fontFamily: "inherit",
  fontSize: 13,
  lineHeight: "20px",
  color: "var(--text-color)",
};

const chipStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  maxWidth: 360,
  minWidth: 0,
  padding: "4px 8px",
  border: divider,
  borderRadius: 3,
};

export function EmailPreview() {
  const file = useCurrentFile();
  const state = useEmail(file?.id);

  let content: ReactNode;
  switch (state.status) {
    case "loading":
      content = (
        <div style={centered}>
          <Loader type={LoaderTypes.oval} size="40px" color={accent} label={t("state.loading")} />
        </div>
      );
      break;
    case "empty":
      content = <Message text={t("state.empty")} />;
      break;
    case "error":
      content = (
        <Message
          text={t(
            state.kind === "noFile"
              ? "state.noFile"
              : state.kind === "load"
                ? "state.loadFailed"
                : "state.parseFailed",
          )}
        />
      );
      break;
    case "ready":
      content = (
        <MessageView
          key={String(state.file.id)}
          email={state.email}
          folderId={state.file.folderId}
        />
      );
      break;
  }

  return (
    <div id="email-viewer-root" style={rootStyle} onKeyDown={(e) => e.stopPropagation()}>
      <div style={cardStyle}>{content}</div>
    </div>
  );
}

function Message({ text }: { text: string }) {
  return (
    <div style={centered}>
      <Text fontSize="14px">{text}</Text>
    </div>
  );
}

function HeaderRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <>
      <Text fontSize="12px" color="var(--text-disable-color)" noSelect>
        {label}
      </Text>
      <Text fontSize="13px" style={{ overflowWrap: "anywhere" }}>
        {value}
      </Text>
    </>
  );
}

function MessageView({ email, folderId }: { email: ParsedEmail; folderId: number | string }) {
  const [allowRemote, setAllowRemote] = useState(false);
  const { saveOne, saveAll, savingAll, isSaving } = useSaveAttachments(folderId);

  const visibleAttachments = useMemo(() => email.attachments.filter((a) => !a.inline), [email]);
  const remote = useMemo(
    () => (email.html ? hasRemoteReferences(email.html) : false),
    [email.html],
  );

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

  const locale = currentLocale();
  const textBody = email.text ?? "";

  return (
    <>
      <header style={{ padding: 16, borderBottom: divider, flex: "0 0 auto" }}>
        <Heading
          level={HeadingLevel.h2}
          size={HeadingSize.medium}
          truncate
          title={email.subject}
          style={{ margin: "0 0 12px" }}
        >
          {email.subject || t("subject.empty")}
        </Heading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "max-content minmax(0, 1fr)",
            gap: "4px 12px",
            alignItems: "baseline",
          }}
        >
          <HeaderRow label={t("header.from")} value={formatAddressList(email.from)} />
          <HeaderRow label={t("header.to")} value={formatAddressList(email.to)} />
          <HeaderRow label={t("header.cc")} value={formatAddressList(email.cc)} />
          <HeaderRow label={t("header.bcc")} value={formatAddressList(email.bcc)} />
          <HeaderRow label={t("header.date")} value={formatDate(email.date, locale)} />
        </div>
      </header>

      {visibleAttachments.length > 0 && (
        <section
          id="email-viewer-attachments"
          style={{
            padding: "8px 16px",
            borderBottom: divider,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            maxHeight: 148,
            overflow: "auto",
            flex: "0 0 auto",
          }}
        >
          <Text fontSize="12px" fontWeight={600} noSelect style={{ marginRight: 4 }}>
            {tf("attachments.title", { count: visibleAttachments.length })}
          </Text>
          {visibleAttachments.map((a) => (
            <AttachmentChip
              key={a.name + a.size}
              attachment={a}
              saving={isSaving(a.name)}
              disabled={savingAll}
              onSave={() => saveOne(a)}
            />
          ))}
          {visibleAttachments.length > 1 && (
            <Button
              id="email-viewer-save-all"
              size={ButtonSize.extraSmall}
              label={t("attachments.saveAll")}
              isLoading={savingAll}
              onClick={() => saveAll(visibleAttachments)}
            />
          )}
        </section>
      )}

      {email.html && remote && (
        <div
          style={{
            padding: "6px 16px",
            background: "var(--background-service-color)",
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            flex: "0 0 auto",
          }}
        >
          <Text fontSize="12px">{t("images.blocked")}</Text>
          <Link
            type={LinkType.action}
            fontSize="12px"
            color="accent"
            onClick={() => setAllowRemote((v) => !v)}
          >
            {allowRemote ? t("images.hide") : t("images.load")}
          </Link>
        </div>
      )}

      <div style={{ flex: "1 1 auto", minHeight: 0 }}>
        {email.html && srcDoc !== null ? (
          <iframe
            style={frameStyle}
            title={t("body.title")}
            sandbox="allow-popups allow-popups-to-escape-sandbox"
            srcDoc={srcDoc}
          />
        ) : textBody.trim() ? (
          <pre className={styles.text} style={textStyle}>
            {linkify(textBody)}
          </pre>
        ) : (
          <Message text={t("body.empty")} />
        )}
      </div>
    </>
  );
}

function AttachmentChip({
  attachment,
  saving,
  disabled,
  onSave,
}: {
  attachment: EmailAttachment;
  saving: boolean;
  disabled: boolean;
  onSave: () => void;
}) {
  return (
    <div className={styles.chip} style={chipStyle} title={attachment.name}>
      <Text fontSize="13px" truncate style={{ minWidth: 0 }}>
        {attachment.name}
      </Text>
      <Text fontSize="12px" color="var(--text-disable-color)" noSelect style={{ flex: "0 0 auto" }}>
        {formatSize(attachment.size)}
      </Text>
      {saving ? (
        <Loader type={LoaderTypes.oval} size="16px" color={accent} style={{ flex: "0 0 auto" }} />
      ) : (
        <Link
          type={LinkType.action}
          fontSize="12px"
          color="accent"
          onClick={disabled ? undefined : onSave}
          noHover={disabled}
          style={{ flex: "0 0 auto" }}
        >
          {t("attachments.save")}
        </Link>
      )}
    </div>
  );
}
