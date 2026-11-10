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

import { ProgressBar } from "@onlyoffice/apps-ui-kit";

import { i18n } from "../locales";
import { DIVIDER } from "../ui/tokens";
import { failureText, type SaveJob } from "./save-store";

/** A running or just finished save of this message's attachments. */
export function SaveProgress({ job }: { job: SaveJob }) {
  const ok = job.finished && job.failed === 0;
  return (
    <div
      id="email-viewer-save-progress"
      style={{ padding: "8px 16px", borderBottom: DIVIDER, flex: "0 0 auto" }}
    >
      <ProgressBar
        percent={job.percent}
        label={
          ok
            ? i18n.t("attachments.savedTo", { folder: job.folderTitle })
            : i18n.t("attachments.progress")
        }
        status={job.finished ? undefined : job.current}
        error={job.finished && job.failed > 0 ? failureText(job) : undefined}
        style={{ width: "100%" }}
      />
    </div>
  );
}
