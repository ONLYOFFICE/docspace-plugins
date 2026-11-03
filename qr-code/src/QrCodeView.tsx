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
import { InfoIcon } from "./icons";
import { t } from "./locales";

import styles from "./QrCodeView.module.css";

type TProps = {
  state: TShareLinkState;
  isRoom: boolean;
  onCopy: (url: string) => void;
  onCreate: () => void;
  /** Only a modal has something to close - an info panel tab is not dismissed this way. */
  onClose?: () => void;
};

// barIsVisible drops the bar's 20px top margin; this its 10px bottom one, both on top of the gap.
const BAR_STYLE = { "--public-room-bar-bottom-margin": "0" } as CSSProperties;

/** What the code opens, and a way to the tab where the link is set up. */
function HintBar({ isRoom }: { isRoom: boolean }) {
  const { openInfoPanel } = usePluginActions();
  const [before, after] = t("hint.body").split("{tab}");

  return (
    <PublicRoomBar
      barIsVisible
      style={BAR_STYLE}
      iconName={<InfoIcon />}
      headerText={t("hint.header")}
      bodyText={
        <>
          {before}
          <Link
            type={LinkType.action}
            color="accent"
            fontSize="12px"
            // The portal closes a plugin modal itself before switching the panel's tab.
            onClick={() => openInfoPanel(isRoom ? "info_members" : "info_share")}
          >
            {t(isRoom ? "hint.membersTab" : "hint.shareTab")}
          </Link>
          {after}
        </>
      }
    />
  );
}

export function QrCodeView({ state, isRoom, onCopy, onCreate, onClose }: TProps) {
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
    case "error":
      body = <Text>{t("modal.error")}</Text>;
      break;
    case "unsupported":
      body = <Text>{t("modal.unsupportedRoom")}</Text>;
      break;
    case "empty":
      body = <Text>{t("modal.noLink")}</Text>;
      primary = (
        <Button
          label={t("link.create")}
          size={ButtonSize.normal}
          primary
          scale={inModal}
          isLoading={state.creating}
          onClick={onCreate}
        />
      );
      break;
    case "ready":
      body = (
        <>
          <HintBar isRoom={isRoom} />
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
