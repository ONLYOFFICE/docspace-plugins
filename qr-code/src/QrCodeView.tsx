import type { CSSProperties, ReactNode } from "react";
import {
  Button,
  ButtonSize,
  Link,
  LinkType,
  Loader,
  LoaderTypes,
  PublicRoomBar,
  Text,
} from "@onlyoffice/apps-ui-kit";
import { usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";
import { QRCodeSVG } from "qrcode.react";

import type { TShareLinkState } from "./useShareLink";
import { LinkRow } from "./LinkRow";
import { AlertIcon, InfoIcon, LinkIcon } from "./icons";
import { t } from "./locales";

import styles from "./QrCodeView.module.css";

type TProps = {
  state: TShareLinkState;
  isRoom: boolean;
  onCopy: (url: string) => void;
  onCreate: () => void;
  onRetry: () => void;
  /** Only a modal has something to close - an info panel tab is not dismissed this way. */
  onClose?: () => void;
};

// barIsVisible drops the bar's 20px top margin; this its 10px bottom one, both on top of the gap.
const BAR_STYLE = { "--public-room-bar-bottom-margin": "0" } as CSSProperties;

// The info panel's own secondary text color, as under a member's name.
const SECONDARY_TEXT = "var(--info-panel-members-subtitle-color)";

/** A string's {tab} placeholder as a link to the tab where the link is set up. */
function WithTabLink({
  text,
  isRoom,
  fontSize,
}: {
  text: string;
  isRoom: boolean;
  fontSize: string;
}) {
  const { openInfoPanel } = usePluginActions();
  const [before, after] = text.split("{tab}");

  return (
    <>
      {before}
      <Link
        type={LinkType.action}
        color="accent"
        fontSize={fontSize}
        // The portal closes a plugin modal itself before switching the panel's tab.
        onClick={() => openInfoPanel(isRoom ? "info_members" : "info_share")}
      >
        {t(isRoom ? "hint.membersTab" : "hint.shareTab")}
      </Link>
      {after}
    </>
  );
}

/** What the code opens, and a way to the tab where the link is set up. */
function HintBar({ isRoom, body }: { isRoom: boolean; body: string }) {
  return (
    <PublicRoomBar
      barIsVisible
      style={BAR_STYLE}
      iconName={<InfoIcon />}
      headerText={t("hint.header")}
      bodyText={<WithTabLink text={body} isRoom={isRoom} fontSize="12px" />}
    />
  );
}

/** Where the code will be once the link exists: the card's frame, dashed, around a faint stand-in. */
function CodePlaceholder() {
  return (
    <div className={styles.placeholder} aria-hidden>
      <QRCodeSVG
        value="qr-code"
        size={192}
        bgColor="transparent"
        fgColor="currentColor"
        className={styles.ghost}
      />
      <span className={`${styles.roundIcon} ${styles.placeholderIcon}`}>
        <LinkIcon />
      </span>
    </div>
  );
}

export function QrCodeView({ state, isRoom, onCopy, onCreate, onRetry, onClose }: TProps) {
  const inModal = !!onClose;
  let body: ReactNode = null;
  let primary: ReactNode = null;

  switch (state.status) {
    case "loading":
      body = (
        <div className={styles.loader}>
          <Loader type={LoaderTypes.track} size="40px" />
        </div>
      );
      break;
    case "error": {
      const retry = (
        <Button
          label={t("modal.retry")}
          size={ButtonSize.normal}
          primary
          scale={inModal}
          onClick={onRetry}
        />
      );
      body = (
        <div className={styles.notice}>
          <span className={styles.roundIcon}>
            <AlertIcon />
          </span>
          <Text fontSize="14px" fontWeight={600} lineHeight="20px">
            {t("error.header")}
          </Text>
          <Text fontSize="12px" lineHeight="16px" color={SECONDARY_TEXT}>
            <WithTabLink text={t("error.body")} isRoom={isRoom} fontSize="12px" />
          </Text>
          {/* In the tab the action sits under its explanation; a modal keeps it in the button row. */}
          {!inModal && <div className={styles.noticeAction}>{retry}</div>}
        </div>
      );
      if (inModal) primary = retry;
      break;
    }
    case "unsupported":
      body = <Text>{t("modal.unsupportedRoom")}</Text>;
      break;
    case "empty":
      body = (
        <>
          <HintBar isRoom={isRoom} body={t("hint.emptyBody")} />
          <CodePlaceholder />
        </>
      );
      // In the tab the link is created on the tab the bar links to, next to its settings.
      if (inModal)
        primary = (
          <Button
            label={t("link.create")}
            size={ButtonSize.normal}
            primary
            scale
            isLoading={state.creating}
            onClick={onCreate}
          />
        );
      break;
    case "ready":
      body = (
        <>
          <HintBar isRoom={isRoom} body={t("hint.body")} />
          <div className={state.link.isExpired ? `${styles.code} ${styles.dim}` : styles.code}>
            <QRCodeSVG value={state.link.url} size={192} />
          </div>
          <LinkRow link={state.link} onCopy={onCopy} />
        </>
      );
      // In the tab the row's own copy icon is the copy action, as on the Share tab.
      if (inModal)
        primary = (
          <Button
            label={t("modal.copy")}
            size={ButtonSize.normal}
            primary
            scale
            isDisabled={state.link.isExpired}
            onClick={() => onCopy(state.link.url)}
          />
        );
      break;
  }

  return (
    <div className={styles.root}>
      {body}
      {(primary || inModal) && (
        <div className={styles.actions}>
          {primary}
          {inModal && (
            <Button label={t("modal.close")} size={ButtonSize.normal} scale onClick={onClose} />
          )}
        </div>
      )}
    </div>
  );
}
