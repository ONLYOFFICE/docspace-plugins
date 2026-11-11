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

import { Button, ButtonSize, Text } from "@onlyoffice/apps-ui-kit";

import type { EmailAttachment } from "../email/types";
import { i18n } from "../locales";
import { PaperclipIcon } from "../ui/icons";
import { SECONDARY_TEXT } from "../ui/tokens";
import { AttachmentChip } from "./AttachmentChip";
import styles from "./attachments.module.css";
import { SaveProgress } from "./SaveProgress";
import { useSaveAttachments } from "./useSaveAttachments";

/**
 * The attachments a reader can save - inline images are shown in the body and left
 * out - and, under them, the progress of a save started from this message.
 */
export function Attachments({
  attachments,
  fileId,
  folderId,
}: {
  attachments: EmailAttachment[];
  fileId: number | string;
  folderId: number | string;
}) {
  const { save, busy, job } = useSaveAttachments(fileId, folderId);

  return (
    <>
      {attachments.length > 0 && (
        <section id="email-viewer-attachments" className={styles.list}>
          <span className={styles.title} style={{ color: SECONDARY_TEXT }}>
            <PaperclipIcon />
            <Text fontSize="12px" fontWeight={600} noSelect>
              {i18n.t("attachments.title", { count: attachments.length })}
            </Text>
          </span>
          {attachments.map((a, index) => (
            <AttachmentChip
              // Two signature images can share a name and a size.
              key={`${index}-${a.name}-${a.size}`}
              attachment={a}
              disabled={busy}
              onSave={() => void save([a])}
            />
          ))}
          {attachments.length > 1 && (
            <Button
              id="email-viewer-save-all"
              size={ButtonSize.extraSmall}
              label={i18n.t("attachments.saveAll")}
              isDisabled={busy}
              onClick={() => void save(attachments)}
            />
          )}
        </section>
      )}
      {job && <SaveProgress job={job} />}
    </>
  );
}
