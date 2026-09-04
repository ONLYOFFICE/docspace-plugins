import { usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";
import { ToastType } from "@onlyoffice/docspace-plugin-sdk";

import { t } from "./locales";

export function useCopyLink(): (link: string) => Promise<void> {
  const { showToast } = usePluginActions();

  return async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      showToast({ type: ToastType.success, title: t("modal.copied") });
    } catch {
      showToast({ type: ToastType.error, title: t("modal.copyFailed") });
    }
  };
}
