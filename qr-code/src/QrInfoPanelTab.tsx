import { useCurrentFile } from "@onlyoffice/docspace-plugin-sdk/react";

import { useShareLink, TShareTarget } from "./useShareLink";
import { useCopyLink } from "./useCopyLink";
import { QrCodeView } from "./QrCodeView";

export function QrInfoPanelTab() {
  const file = useCurrentFile();
  const copyLink = useCopyLink();

  const kind: TShareTarget["kind"] = file?.isFolder || file?.isRoom ? "folder" : "file";
  const target: TShareTarget | null = file ? { id: file.id, kind, isRoom: !!file.isRoom } : null;
  const { state, create } = useShareLink(target);

  return <QrCodeView state={state} isRoom={!!target?.isRoom} onCopy={copyLink} onCreate={create} />;
}
