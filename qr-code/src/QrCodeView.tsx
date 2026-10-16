import { Button, ButtonSize, Loader, LoaderTypes, Text } from "@onlyoffice/apps-ui-kit";
import { QRCodeSVG } from "qrcode.react";

import { TShareLinkState } from "./useShareLink";
import { t } from "./locales";

import styles from "./QrCodeView.module.css";

type TProps = {
  state: TShareLinkState;
  onCopy: (link: string) => void;
  /** Only a modal has something to close - an info panel tab is not dismissed this way. */
  onClose?: () => void;
};

export function QrCodeView({ state, onCopy, onClose }: TProps) {
  return (
    <div className={styles.root}>
      {state.status === "loading" && <Loader type={LoaderTypes.track} size="40px" />}
      {state.status === "error" && <Text>{t("modal.error")}</Text>}
      {state.status === "empty" && <Text>{t("modal.noLink")}</Text>}
      {state.status === "unsupported" && <Text>{t("modal.unsupportedRoom")}</Text>}
      {state.status === "ready" && (
        <>
          <div className={styles.code}>
            <QRCodeSVG value={state.link} size={200} />
          </div>
          <div className={styles.actions}>
            <Button label={t("modal.copy")} size={ButtonSize.normal} scale onClick={() => onCopy(state.link)} />
            {onClose && <Button label={t("modal.close")} size={ButtonSize.normal} scale onClick={onClose} />}
          </div>
        </>
      )}
    </div>
  );
}
