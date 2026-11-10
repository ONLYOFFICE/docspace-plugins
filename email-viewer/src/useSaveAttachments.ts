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

import { useSyncExternalStore } from "react";
import { SelectorType, ToastType } from "@onlyoffice/docspace-plugin-sdk";
import {
  usePluginActions,
  usePluginAPI,
  type PluginActions,
  type PluginAPIClient,
} from "@onlyoffice/docspace-plugin-sdk/react";

import type { EmailAttachment } from "./email/types";
import { i18n } from "./locales";

type TUploadSession = {
  data?: { location?: string };
  location?: string;
  response?: { data?: { location?: string } };
};

type TFolderInfo = { title?: string; security?: { Create?: boolean } };

type TFolder = { id: number | string; title: string };

/** Where a save has got to, for the message it was started from. */
export type SaveJob = {
  fileId: number | string;
  percent: number;
  /** The attachment being sent; empty once the job has ended. */
  current: string;
  finished: boolean;
  failed: number;
  /** The last attachment that did not save, for a message about a single one. */
  failedName: string;
  total: number;
  folderTitle: string;
};

// How long the outcome stays on screen.
const RESULT_MS = 6000;

/**
 * A save writes files, so it runs to the end even when the message is closed, and a
 * second one must not start beside it. Its state therefore lives in module scope, and
 * a message reads it through this store: paging away and back finds it where it is.
 * The progress is drawn inside the viewer, because the viewer covers the portal page
 * and everything on it, the portal's own progress button included.
 */
let job: SaveJob | null = null;
const listeners = new Set<() => void>();
const setJob = (next: SaveJob | null) => {
  job = next;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getJob = () => job;

/**
 * Chunked-upload session; the envelope differs between the api client and a raw
 * response, hence the three places the location is looked for.
 */
async function createUploadLocation(
  api: PluginAPIClient,
  folderId: number | string,
  attachment: EmailAttachment,
): Promise<string> {
  const session = await api.post<TUploadSession>(`/files/${folderId}/upload/create_session`, {
    createOn: new Date().toISOString(),
    fileName: attachment.name,
    fileSize: attachment.size,
    createNewIfExist: true,
  });
  const location =
    session?.data?.location ?? session?.location ?? session?.response?.data?.location;
  if (!location) throw new Error("Upload session returned no location");
  return location;
}

/**
 * The bytes go to the session's location, a full URL on the portal, with the session
 * cookie. XMLHttpRequest rather than fetch: only it reports how much has been sent,
 * which is what keeps the progress moving inside one large attachment.
 */
function sendBytes(
  location: string,
  attachment: EmailAttachment,
  onProgress: (sent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", location);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => onProgress(Math.min(e.loaded, attachment.size));
    xhr.onerror = () => reject(new Error("Upload failed: network error"));
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`Upload failed: HTTP ${xhr.status}`));
        return;
      }
      // The chunked uploader can answer 200 with { success: false } on a refused write.
      try {
        if (JSON.parse(xhr.responseText)?.success === false) {
          reject(new Error("Upload refused"));
          return;
        }
      } catch {
        // not JSON: the status already said it went through
      }
      resolve();
    };
    const form = new FormData();
    form.append(
      "file",
      new File([attachment.content as BlobPart], attachment.name, { type: attachment.mimeType }),
    );
    xhr.send(form);
  });
}

/**
 * The portal's own folder picker, opened on the message's folder. Select is gated on
 * the folder being browsed; whether files may be added there is only known from the
 * folder itself, so onSubmit asks and keeps the picker open on a refusal.
 */
function pickFolder(
  actions: PluginActions,
  api: PluginAPIClient,
  startFolderId: number | string | null,
): Promise<TFolder | null> {
  return new Promise((resolve) => {
    let done = false;
    const finish = (value: TFolder | null) => {
      if (done) return;
      done = true;
      resolve(value);
      actions.closeSelector();
    };
    const cancel = () => finish(null);

    actions.showSelector({
      type: SelectorType.Files,
      props: {
        withHeader: true,
        headerProps: {
          label: i18n.t("attachments.chooseFolder"),
          isCloseable: true,
          onCloseClick: cancel,
        },
        withBreadCrumbs: true,
        withSearch: true,
        withCreate: true,
        currentFolderId: startFolderId ?? undefined,
        submitButtonLabel: i18n.t("attachments.saveHere"),
        withCancelButton: true,
        onCancel: cancel, // the cancel button and the header cross
        onClose: cancel, // a click on the backdrop
        getIsDisabled: ({ isFirstLoad, selectedItemId, selectedItemType }) =>
          isFirstLoad || !selectedItemId || selectedItemType === "rooms",
        onSubmit: async ({ selectedItemId, folderTitle }) => {
          if (selectedItemId === undefined) return;
          let title = folderTitle;
          try {
            const folder = await api.get<TFolderInfo>(`/files/folder/${selectedItemId}`);
            if (folder?.security?.Create !== true) {
              actions.showToast({ type: ToastType.warning, title: i18n.t("attachments.noRights") });
              return;
            }
            title = folder.title || folderTitle;
          } catch {
            // The folder could not be read: let the upload itself say whether it may write.
          }
          finish({ id: selectedItemId, title });
        },
      },
    });
  });
}

/**
 * Saves attachments into a folder the user picks, one after another. Progress counts
 * the bytes sent across all of them; the hook hands back the job of this message only.
 */
export function useSaveAttachments(fileId: number | string, startFolderId: number | string | null) {
  const api = usePluginAPI();
  const actions = usePluginActions();
  const current = useSyncExternalStore(subscribe, getJob);

  const save = async (attachments: EmailAttachment[]) => {
    if ((job && !job.finished) || attachments.length === 0) return;
    const folder = await pickFolder(actions, api, startFolderId);
    if (!folder) return;

    const total = attachments.reduce((sum, a) => sum + a.size, 0) || 1;
    const state: SaveJob = {
      fileId,
      percent: 0,
      current: attachments[0].name,
      finished: false,
      failed: 0,
      failedName: "",
      total: attachments.length,
      folderTitle: folder.title,
    };
    setJob({ ...state });

    let sentBefore = 0;
    for (const attachment of attachments) {
      state.current = attachment.name;
      setJob({ ...state });
      try {
        const location = await createUploadLocation(api, folder.id, attachment);
        await sendBytes(location, attachment, (sent) => {
          // Whole percents only, and 100 is kept for the end.
          const next = Math.min(99, Math.floor(((sentBefore + sent) / total) * 100));
          if (next > state.percent) {
            state.percent = next;
            setJob({ ...state });
          }
        });
      } catch {
        state.failed += 1;
        state.failedName = attachment.name;
      }
      sentBefore += attachment.size;
    }

    const finished: SaveJob = { ...state, percent: 100, current: "", finished: true };
    setJob(finished);
    if (finished.failed > 0) {
      actions.showToast({
        type: ToastType.error,
        title:
          attachments.length === 1
            ? i18n.t("toast.saveFailed", { name: attachments[0].name })
            : i18n.t("toast.saveFailedSome", { failed: finished.failed, total: finished.total }),
      });
    }
    setTimeout(() => {
      if (job === finished) setJob(null);
    }, RESULT_MS);
  };

  return {
    save,
    /** A save is running somewhere: no second one until it ends. */
    busy: current !== null && !current.finished,
    job: current?.fileId === fileId ? current : null,
  };
}
