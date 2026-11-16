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

import { i18n } from "../locales";
import { BackIcon, ChevronIcon } from "../ui/icons";
import styles from "./viewer.module.css";

/**
 * The viewer gives a plugin no chrome on a phone: its back button, title and context menu
 * are drawn for images, video and PDF only, and a plugin is left with swipes, which
 * useStopViewerSwipe turns off so that text can be selected. This bar stands in for that
 * header; CSS shows it only where the viewer is in its mobile mode.
 *
 * Paging goes through the arrow keys the viewer listens for on document: no SDK action
 * moves through its playlist, and the plugin cannot know the playlist to pick a file
 * itself. At either end of the playlist the viewer ignores the key, as it does a real one.
 */
export function MobileBar({ title }: { title: string }) {
  const { closeMediaViewer } = usePluginActions();

  return (
    <div className={styles.mobileBar}>
      <button
        type="button"
        className={styles.barButton}
        aria-label={i18n.t("viewer.close")}
        onClick={closeMediaViewer}
      >
        <BackIcon />
      </button>
      <span className={styles.barTitle}>{title}</span>
      <button
        type="button"
        className={styles.barButton}
        aria-label={i18n.t("viewer.previous")}
        onClick={() => pressArrow("ArrowLeft")}
      >
        <ChevronIcon />
      </button>
      <button
        type="button"
        className={`${styles.barButton} ${styles.mirrored}`}
        aria-label={i18n.t("viewer.next")}
        onClick={() => pressArrow("ArrowRight")}
      >
        <ChevronIcon />
      </button>
    </div>
  );
}

const pressArrow = (code: "ArrowLeft" | "ArrowRight") =>
  document.dispatchEvent(new KeyboardEvent("keydown", { code, key: code, bubbles: true }));
