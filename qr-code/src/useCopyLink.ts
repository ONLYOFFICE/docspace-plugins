import { usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";
import { ToastType } from "@onlyoffice/docspace-plugin-sdk";
import copy from "copy-to-clipboard";

import { t } from "./locales";

async function writeClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }
  return copy(text);
}

export function useCopyLink(): (link: string) => Promise<void> {
  const { showToast } = usePluginActions();

  return async (link: string) => {
    if (await writeClipboard(link)) {
      showToast({ type: ToastType.success, title: t("modal.copied") });
    } else {
      showToast({ type: ToastType.error, title: t("modal.copyFailed") });
    }
  };
}
