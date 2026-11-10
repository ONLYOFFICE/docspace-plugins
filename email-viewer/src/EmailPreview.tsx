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

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useCurrentFile, useCurrentUser } from "@onlyoffice/docspace-plugin-sdk/react";
import {
  Button,
  ButtonSize,
  Heading,
  HeadingLevel,
  HeadingSize,
  Link,
  LinkTarget,
  LinkType,
  Loader,
  LoaderTypes,
  ProgressBar,
  Text,
} from "@onlyoffice/apps-ui-kit";

import { buildHtmlDocument, remoteUrls } from "./email/body-document";
import { formatDate, formatSize } from "./email/format";
import { linkify } from "./email/linkify";
import type { EmailAddress, EmailAttachment, ParsedEmail } from "./email/types";
import { ImageIcon, PaperclipIcon, WarningIcon } from "./icons";
import { i18n } from "./locales";
import { useCspBlockedOrigins, type CspBlock } from "./useCspBlockedOrigins";
import { HtmlFrame, useHtmlFrameAvailable } from "./htmlFrame";
import { useEmail } from "./useEmail";
import { useSaveAttachments, type SaveJob } from "./useSaveAttachments";
import styles from "./EmailPreview.module.css";

// The root, the card and the header are sized in EmailPreview.module.css: they follow the
// viewer's chrome, which differs between desktop and phone, and only a media query can.

const centered: CSSProperties = {
  flex: "1 1 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  textAlign: "center",
};

const divider = "1px solid var(--border-service-color)";

// Labels, addresses, sizes. Not --text-disable-color: that is the colour of a control
// that cannot be used, and on the dark theme it is #5c5c5c, close to unreadable.
const SECONDARY = "var(--info-panel-members-subtitle-color)";

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

const bannerRow: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
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
  const rootRef = useRef<HTMLDivElement>(null);

  // On a touch screen the viewer pages and closes on a finger drag anywhere on its stage,
  // through a native listener on its wrapper. Over a message that leaves no way to select
  // and copy text: the long press and the selection handles move the whole message. So a
  // touch that starts on the message stays with it; a mouse is left alone, the viewer
  // ignores drags on a desktop anyway. The message body needs nothing - a touch inside its
  // frame never reaches this document.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const keep = (e: Event) => {
      if (!(e instanceof PointerEvent) || e.pointerType !== "mouse") e.stopPropagation();
    };
    root.addEventListener("pointerdown", keep);
    root.addEventListener("touchstart", keep, { passive: true });
    return () => {
      root.removeEventListener("pointerdown", keep);
      root.removeEventListener("touchstart", keep);
    };
  }, []);

  let content: ReactNode;
  switch (state.status) {
    case "loading":
      content = (
        <div style={centered}>
          <Loader
            type={LoaderTypes.oval}
            size="40px"
            color={accent}
            label={i18n.t("state.loading")}
          />
        </div>
      );
      break;
    case "empty":
      content = <Message text={i18n.t("state.empty")} />;
      break;
    case "error":
      content = (
        <Message
          text={i18n.t(
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
          fileId={state.file.id}
          folderId={state.file.folderId}
        />
      );
      break;
  }

  return (
    <div
      id="email-viewer-root"
      ref={rootRef}
      className={styles.root}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className={styles.card}>{content}</div>
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

function HeaderRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Text fontSize="12px" color={SECONDARY} noSelect>
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
      {a.name && a.address && <span style={{ color: SECONDARY }}> &lt;{a.address}&gt;</span>}
    </Fragment>
  ));
}

// Mid-tone colours that carry white initials in both themes.
const AVATAR_COLORS = [
  "#4781d1",
  "#2db482",
  "#f2994a",
  "#9b51e0",
  "#eb5757",
  "#219fb3",
  "#c2185b",
  "#6d9f2f",
];

/** The same address always gets the same colour, so a sender is recognised at a glance. */
const avatarColor = (key: string): string => {
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const initials = ({ name, address }: EmailAddress): string => {
  const words = (name || address.split("@")[0]).split(/[\s._-]+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => [...w][0])
    .join("")
    .toUpperCase();
};

/** From, To, Cc, Bcc and Date as one block, labels in a column of their own. */
function MessageHeaders({ email, date }: { email: ParsedEmail; date: string }) {
  const sender = email.from[0];
  const rows: [string, EmailAddress[]][] = [
    ["header.to", email.to],
    ["header.cc", email.cc],
    ["header.bcc", email.bcc],
  ];
  return (
    <div className={styles.headerBlock}>
      {sender && (
        <div
          className={styles.avatar}
          style={{ background: avatarColor((sender.address || sender.name).toLowerCase()) }}
          aria-hidden="true"
        >
          {initials(sender) || "?"}
        </div>
      )}
      <div
        style={{
          flex: "1 1 auto",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns: "max-content minmax(0, 1fr)",
          gap: "6px 16px",
          alignItems: "baseline",
        }}
      >
        {email.from.length > 0 && (
          <HeaderRow label={i18n.t("header.from")}>
            <Addresses list={email.from} strong />
          </HeaderRow>
        )}
        {rows.map(
          ([key, list]) =>
            list.length > 0 && (
              <HeaderRow key={key} label={i18n.t(key)}>
                <Addresses list={list} />
              </HeaderRow>
            ),
        )}
        {date && <HeaderRow label={i18n.t("header.date")}>{date}</HeaderRow>}
      </div>
    </div>
  );
}

function RemoteImagesNotice({
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
  // Amber while something is withheld - by the reader's choice or by the portal's
  // policy; a quiet grey once the images are on screen.
  const warning = !allowRemote || blocked.length > 0;
  const message = !allowRemote
    ? "images.blocked"
    : blocked.length > 0
      ? "images.cspBlocked"
      : "images.shown";

  return (
    <div
      id="email-viewer-remote"
      className={`${styles.notice} ${warning ? styles.noticeWarning : styles.noticeInfo}`}
    >
      <span className={styles.noticeIcon}>{warning ? <WarningIcon /> : <ImageIcon />}</span>
      <div
        style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}
      >
        <div style={bannerRow}>
          <Text fontSize="12px" fontWeight={warning ? 600 : 400}>
            {i18n.t(message)}
          </Text>
          <Link type={LinkType.action} fontSize="12px" color="accent" onClick={onToggle}>
            {allowRemote ? i18n.t("images.hide") : i18n.t("images.load")}
          </Link>
        </div>
        {allowRemote && blocked.length > 0 && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {blocked.map(({ origin }) => (
                <span key={origin} className={styles.origin}>
                  {origin}
                </span>
              ))}
            </div>
            {/* The site itself is allowed and redirects elsewhere: adding it again would
                change nothing, so the administrator is told where to look instead. */}
            {isAdmin &&
              blocked
                .filter((b) => b.redirected)
                .map(({ origin }) => (
                  <Text key={`redirect-${origin}`} fontSize="12px">
                    {i18n.t("images.cspRedirect", { site: origin })}
                  </Text>
                ))}
            {/* Only an administrator can change the policy, and allowing a site there
                trusts it with far more than images - so the hint says so, and nobody
                else is sent to ask for it. */}
            {isAdmin && (
              <div style={bannerRow}>
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
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MessageView({
  email,
  fileId,
  folderId,
}: {
  email: ParsedEmail;
  fileId: number | string;
  folderId: number | string;
}) {
  const [allowRemote, setAllowRemote] = useState(false);
  const { save, busy, job } = useSaveAttachments(fileId, folderId);

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
  const user = useCurrentUser();
  const isAdmin = Boolean(user?.isAdmin || user?.isOwner);

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

  const locale = i18n.locale;
  const textBody = email.text ?? "";

  return (
    <>
      <header className={styles.header} style={{ borderBottom: divider }}>
        <Heading
          level={HeadingLevel.h2}
          size={HeadingSize.medium}
          truncate
          title={email.subject}
          style={{ margin: 0 }}
        >
          {email.subject || i18n.t("subject.empty")}
        </Heading>
        <MessageHeaders email={email} date={formatDate(email.date, locale)} />
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
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginInlineEnd: 4,
              color: SECONDARY,
            }}
          >
            <PaperclipIcon />
            <Text fontSize="12px" fontWeight={600} noSelect>
              {i18n.t("attachments.title", { count: visibleAttachments.length })}
            </Text>
          </span>
          {visibleAttachments.map((a) => (
            <AttachmentChip
              key={a.name + a.size}
              attachment={a}
              disabled={busy}
              onSave={() => void save([a])}
            />
          ))}
          {visibleAttachments.length > 1 && (
            <Button
              id="email-viewer-save-all"
              size={ButtonSize.extraSmall}
              label={i18n.t("attachments.saveAll")}
              isDisabled={busy}
              onClick={() => void save(visibleAttachments)}
            />
          )}
        </section>
      )}

      {job && <SaveProgress job={job} />}

      {remote.length > 0 && (
        <RemoteImagesNotice
          allowRemote={allowRemote}
          blocked={blocked}
          isAdmin={isAdmin}
          onToggle={() => setAllowRemote((v) => !v)}
        />
      )}

      <div style={{ flex: "1 1 auto", minHeight: 0 }}>
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
          <pre className={styles.text} style={textStyle}>
            {linkify(textBody)}
          </pre>
        ) : (
          <Message text={i18n.t("body.empty")} />
        )}
      </div>
    </>
  );
}

/**
 * The save of this message's attachments, drawn inside the viewer: the viewer covers
 * the portal page, so a progress shown anywhere outside it would not be seen.
 */
function SaveProgress({ job }: { job: SaveJob }) {
  const ok = job.finished && job.failed === 0;
  const error =
    !job.finished || job.failed === 0
      ? undefined
      : job.total === 1
        ? i18n.t("toast.saveFailed", { name: job.failedName })
        : i18n.t("toast.saveFailedSome", { failed: job.failed, total: job.total });
  return (
    <div
      id="email-viewer-save-progress"
      style={{ padding: "8px 16px", borderBottom: divider, flex: "0 0 auto" }}
    >
      <ProgressBar
        percent={job.percent}
        label={
          ok
            ? i18n.t("attachments.savedTo", { folder: job.folderTitle })
            : i18n.t("attachments.progress")
        }
        status={job.finished ? undefined : job.current}
        error={error}
        style={{ width: "100%" }}
      />
    </div>
  );
}

/** A chip only stops taking clicks while a save runs; the progress is drawn below. */
function AttachmentChip({
  attachment,
  disabled,
  onSave,
}: {
  attachment: EmailAttachment;
  disabled: boolean;
  onSave: () => void;
}) {
  return (
    <div className={styles.chip} style={chipStyle} title={attachment.name}>
      <Text fontSize="13px" truncate style={{ minWidth: 0 }}>
        {attachment.name}
      </Text>
      <Text fontSize="12px" color={SECONDARY} noSelect style={{ flex: "0 0 auto" }}>
        {formatSize(attachment.size)}
      </Text>
      <Link
        type={LinkType.action}
        fontSize="12px"
        color={disabled ? "var(--text-disable-color)" : "accent"}
        onClick={disabled ? undefined : onSave}
        noHover={disabled}
        style={{ flex: "0 0 auto" }}
      >
        {i18n.t("attachments.save")}
      </Link>
    </div>
  );
}
