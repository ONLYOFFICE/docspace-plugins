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

import { Link, LinkType, Text } from "@onlyoffice/apps-ui-kit";

import { formatSize } from "../email/format";
import type { EmailAttachment } from "../email/types";
import { i18n } from "../locales";
import { DISABLED, SECONDARY_TEXT } from "../ui/tokens";
import styles from "./attachments.module.css";

/** Name, size and Save. While a save runs the chip only stops taking clicks. */
export function AttachmentChip({
  attachment,
  disabled,
  onSave,
}: {
  attachment: EmailAttachment;
  disabled: boolean;
  onSave: () => void;
}) {
  return (
    <div className={styles.chip} title={attachment.name}>
      <Text fontSize="13px" truncate style={{ minWidth: 0 }}>
        {attachment.name}
      </Text>
      <Text fontSize="12px" color={SECONDARY_TEXT} noSelect style={{ flex: "0 0 auto" }}>
        {formatSize(attachment.size)}
      </Text>
      <Link
        type={LinkType.action}
        fontSize="12px"
        color={disabled ? DISABLED : "accent"}
        onClick={disabled ? undefined : onSave}
        noHover={disabled}
        style={{ flex: "0 0 auto" }}
      >
        {i18n.t("attachments.save")}
      </Link>
    </div>
  );
}
