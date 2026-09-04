import { usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";

import { getTarget } from "./target";
import { useShareLink } from "./useShareLink";
import { useCopyLink } from "./useCopyLink";
import { QrCodeView } from "./QrCodeView";

export function QrCodeModal() {
  const { closeModal } = usePluginActions();
  const state = useShareLink(getTarget());
  const copyLink = useCopyLink();

  return <QrCodeView state={state} onCopy={copyLink} onClose={closeModal} />;
}
