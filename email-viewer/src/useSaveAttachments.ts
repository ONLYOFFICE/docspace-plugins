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

import { useCallback, useState } from "react";
import { ToastType } from "@onlyoffice/docspace-plugin-sdk";
import {
  usePluginActions,
  usePluginAPI,
  type PluginAPIClient,
} from "@onlyoffice/docspace-plugin-sdk/react";

import type { EmailAttachment } from "./email/types";
import { t, tf } from "./locales";

type TUploadSession = {
  data?: { location?: string };
  location?: string;
  response?: { data?: { location?: string } };
};

/**
 * Chunked-upload session, then the bytes to the location it returns. The location
 * is a full URL, so it goes through plain fetch with the session cookie. The
 * envelope shape differs between the api client and a raw response, hence the three
 * places the location is looked for.
 */
async function uploadToFolder(
  api: PluginAPIClient,
  folderId: number | string,
  attachment: EmailAttachment,
): Promise<void> {
  const session = await api.post<TUploadSession>(`/files/${folderId}/upload/create_session`, {
    createOn: new Date().toISOString(),
    fileName: attachment.name,
    fileSize: attachment.size,
    createNewIfExist: true,
  });
  const location =
    session?.data?.location ?? session?.location ?? session?.response?.data?.location;
  if (!location) throw new Error("Upload session returned no location");

  const form = new FormData();
  form.append(
    "file",
    new File([attachment.content as BlobPart], attachment.name, { type: attachment.mimeType }),
  );
  const response = await fetch(location, { method: "POST", body: form, credentials: "include" });
  if (!response.ok) throw new Error(`Upload failed: HTTP ${response.status}`);
}

export function useSaveAttachments(folderId: number | string | null) {
  const api = usePluginAPI();
  const { showToast } = usePluginActions();
  const [saving, setSaving] = useState<Set<string>>(() => new Set());
  const [savingAll, setSavingAll] = useState(false);

  const mark = (name: string, on: boolean) =>
    setSaving((prev) => {
      const next = new Set(prev);
      if (on) next.add(name);
      else next.delete(name);
      return next;
    });

  const save = useCallback(
    async (attachment: EmailAttachment): Promise<boolean> => {
      if (folderId === null) return false;
      mark(attachment.name, true);
      try {
        await uploadToFolder(api, folderId, attachment);
        return true;
      } catch {
        return false;
      } finally {
        mark(attachment.name, false);
      }
    },
    [api, folderId],
  );

  const saveOne = useCallback(
    async (attachment: EmailAttachment) => {
      const ok = await save(attachment);
      showToast({
        type: ok ? ToastType.success : ToastType.error,
        title: tf(ok ? "toast.saved" : "toast.saveFailed", { name: attachment.name }),
      });
    },
    [save, showToast],
  );

  const saveAll = useCallback(
    async (attachments: EmailAttachment[]) => {
      setSavingAll(true);
      let failed = 0;
      try {
        for (const attachment of attachments) {
          if (!(await save(attachment))) failed += 1;
        }
      } finally {
        setSavingAll(false);
      }
      if (failed === 0) {
        showToast({
          type: ToastType.success,
          title: tf("toast.savedAll", { count: attachments.length }),
        });
      } else {
        showToast({
          type: ToastType.error,
          title: tf("toast.saveFailedSome", { failed, total: attachments.length }),
        });
      }
    },
    [save, showToast],
  );

  return {
    saveOne,
    saveAll,
    savingAll,
    isSaving: (name: string) => saving.has(name),
    canSave: folderId !== null,
    saveLabel: t("attachments.save"),
  };
}
