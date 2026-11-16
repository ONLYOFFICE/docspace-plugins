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
