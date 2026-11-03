import { useId, type ReactNode } from "react";
import { IconButton, Text, Tooltip } from "@onlyoffice/apps-ui-kit";

import type { TShareLink } from "./useShareLink";
import { currentLocale, t, tf, type TStrings } from "./locales";
import {
  CommentIcon,
  CopyIcon,
  EditIcon,
  EyeIcon,
  FillFormsIcon,
  FilterIcon,
  GlobeIcon,
  LinkIcon,
  LockIcon,
  PeopleIcon,
  ReviewIcon,
} from "./icons";

import styles from "./QrCodeView.module.css";

// FileShare values a link can carry, with the icon the Share tab shows for each.
const ACCESS: Record<number, { icon: ReactNode; label: keyof TStrings }> = {
  1: { icon: <EditIcon />, label: "access.edit" },
  2: { icon: <EyeIcon />, label: "access.read" },
  5: { icon: <ReviewIcon />, label: "access.review" },
  6: { icon: <CommentIcon />, label: "access.comment" },
  7: { icon: <FillFormsIcon />, label: "access.fillForms" },
  8: { icon: <FilterIcon />, label: "access.customFilter" },
  10: { icon: <EditIcon />, label: "access.edit" },
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(currentLocale(), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

type TProps = {
  link: TShareLink;
  onCopy: (url: string) => void;
};

/** The Share tab's link row, read-only: its settings are changed there, not here. */
export function LinkRow({ link, onCopy }: TProps) {
  const access = ACCESS[link.access] ?? ACCESS[2];
  const audience = link.internal ? t("link.internal") : t("link.anyone");

  // One kit tooltip for the row's icons. Anchors are matched across the whole document, so the
  // id is per instance: the dialog and the tab can be on screen together.
  const tooltipId = useId();
  const hint = (text: string) => ({
    "data-tooltip-id": tooltipId,
    "data-tooltip-content": text,
    "aria-label": text,
  });

  let validity = t("link.noTimeLimit");
  if (link.isExpired) validity = t("link.expired");
  else if (link.expirationDate)
    validity = tf("link.validUntil", { date: formatDate(link.expirationDate) });

  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        <LinkIcon />
        {link.hasPassword && (
          <span className={styles.lock} {...hint(t("link.password"))}>
            <LockIcon />
          </span>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.titleLine}>
          <Text
            fontSize="14px"
            fontWeight={600}
            lineHeight="16px"
            truncate
            title={link.title}
            color={link.isExpired ? "var(--info-panel-link-expired)" : undefined}
            style={{ minWidth: 0 }}
          >
            {link.title}
          </Text>
          {!link.isExpired && (
            <span className={styles.copy} {...hint(t("modal.copy"))}>
              <IconButton size={12} iconNode={<CopyIcon />} onClick={() => onCopy(link.url)} />
            </span>
          )}
        </div>
        <Text
          fontSize="12px"
          lineHeight="16px"
          color={
            link.isExpired
              ? "var(--info-panel-link-expired)"
              : "var(--info-panel-links-primary-color, var(--info-panel-members-subtitle-color))"
          }
        >
          {validity}
        </Text>
      </div>
      <div className={styles.badges}>
        <span {...hint(audience)}>{link.internal ? <PeopleIcon /> : <GlobeIcon />}</span>
        <span {...hint(t(access.label))}>{access.icon}</span>
      </div>
      <Tooltip id={tooltipId} />
    </div>
  );
}
