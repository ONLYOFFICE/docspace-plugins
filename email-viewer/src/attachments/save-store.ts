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

import { i18n } from "../locales";

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

/**
 * A save writes files, so it runs to the end even when the message is closed, and a
 * second one must not start beside it. Its state therefore lives here, in module scope,
 * and a message reads it through useSyncExternalStore: paging away and back finds the
 * save where it is.
 */
let job: SaveJob | null = null;
const listeners = new Set<() => void>();

export const getSaveJob = (): SaveJob | null => job;

export const setSaveJob = (next: SaveJob | null): void => {
  job = next;
  listeners.forEach((listener) => listener());
};

export const subscribeSaveJob = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** What went wrong, for the progress line and the toast alike. */
export const failureText = (job: SaveJob): string =>
  job.total === 1
    ? i18n.t("toast.saveFailed", { name: job.failedName })
    : i18n.t("toast.saveFailedSome", { failed: job.failed, total: job.total });
