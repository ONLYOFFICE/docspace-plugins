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
import { ToastType } from "@onlyoffice/docspace-plugin-sdk";
import { usePluginActions, usePluginAPI } from "@onlyoffice/docspace-plugin-sdk/react";

import type { EmailAttachment } from "../email/types";
import { pickFolder } from "./pick-folder";
import { failureText, getSaveJob, setSaveJob, subscribeSaveJob, type SaveJob } from "./save-store";
import { uploadAttachment } from "./upload";

// How long the outcome stays on screen.
const RESULT_MS = 6000;

/**
 * Saves attachments into a folder the user picks, one after another. Progress counts the
 * bytes sent across all of them and is drawn inside the viewer (SaveProgress), because
 * the viewer covers the portal page and its progress button with it. The hook hands back
 * the job of this message only.
 */
export function useSaveAttachments(fileId: number | string, startFolderId: number | string | null) {
  const api = usePluginAPI();
  const actions = usePluginActions();
  const current = useSyncExternalStore(subscribeSaveJob, getSaveJob);

  const save = async (attachments: EmailAttachment[]) => {
    const running = getSaveJob();
    if ((running && !running.finished) || attachments.length === 0) return;
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

    let sentBefore = 0;
    for (const attachment of attachments) {
      state.current = attachment.name;
      setSaveJob({ ...state });
      try {
        await uploadAttachment(api, folder.id, attachment, (sent) => {
          // Whole percents only, and 100 is kept for the end.
          const next = Math.min(99, Math.floor(((sentBefore + sent) / total) * 100));
          if (next > state.percent) {
            state.percent = next;
            setSaveJob({ ...state });
          }
        });
      } catch {
        state.failed += 1;
        state.failedName = attachment.name;
      }
      sentBefore += attachment.size;
    }

    const finished: SaveJob = { ...state, percent: 100, current: "", finished: true };
    setSaveJob(finished);
    if (finished.failed > 0) {
      // Also as a toast: the message may have been closed while the save ran.
      actions.showToast({ type: ToastType.error, title: failureText(finished) });
    }
    setTimeout(() => {
      if (getSaveJob() === finished) setSaveJob(null);
    }, RESULT_MS);
  };

  return {
    save,
    /** A save is running somewhere: no second one until it ends. */
    busy: current !== null && !current.finished,
    job: current?.fileId === fileId ? current : null,
  };
}
