import { usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";

import { getTarget } from "./target";
import { useShareLink } from "./useShareLink";
import { useCopyLink } from "./useCopyLink";
import { QrCodeView } from "./QrCodeView";

export function QrCodeModal() {
  const { closeModal } = usePluginActions();
  const target = getTarget();
  const { state, create } = useShareLink(target);
  const copyLink = useCopyLink();

  return (
    <QrCodeView
      state={state}
      isRoom={!!target?.isRoom}
      onCopy={copyLink}
      onCreate={create}
      onClose={closeModal}
    />
  );
}
