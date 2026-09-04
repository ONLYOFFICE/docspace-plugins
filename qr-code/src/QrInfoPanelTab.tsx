import { useCurrentFile } from "@onlyoffice/docspace-plugin-sdk/react";

import { useShareLink, TShareTarget } from "./useShareLink";
import { useCopyLink } from "./useCopyLink";
import { QrCodeView } from "./QrCodeView";

export function QrInfoPanelTab() {
  const file = useCurrentFile();
  const copyLink = useCopyLink();

  const kind: TShareTarget["kind"] = file?.isFolder || file?.isRoom ? "folder" : "file";
  const target: TShareTarget | null = file ? { id: file.id, kind } : null;
  const state = useShareLink(target);

  return <QrCodeView state={state} onCopy={copyLink} />;
}
