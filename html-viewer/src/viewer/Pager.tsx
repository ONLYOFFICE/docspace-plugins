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
import { icons } from "../ui/icons";
import ui from "../ui/ui.module.css";
import styles from "./viewer.module.css";

// The viewer pages through the folder on ← and → pressed anywhere in the document, and
// a plugin has no other way to ask it to: the playlist is the portal's, not the plugin's.
// ponytail: relies on the viewer's own key handler, not on the SDK - switch to an SDK
// paging action once there is one.
const page = (key: "ArrowLeft" | "ArrowRight") =>
  document.dispatchEvent(new KeyboardEvent("keydown", { key, code: key, bubbles: true }));

/**
 * Where the viewer draws no side arrows and no header - on a phone or a tablet - its
 * only paging is a swipe, which the preview frame swallows. So the file name and the
 * arrows are drawn here. At either end of the folder an arrow does nothing, as the
 * swipe does: the plugin cannot see the playlist.
 */
export function Pager({ title }: { title?: string }) {
  return (
    <div id="html-viewer-pager" className={styles.pager}>
      <button
        id="html-viewer-previous"
        type="button"
        className={ui.action}
        aria-label={i18n.t("file.previous")}
        title={i18n.t("file.previous")}
        onClick={() => page("ArrowLeft")}
      >
        {icons.previous}
      </button>
      <span className={styles.fileName}>{title}</span>
      <button
        id="html-viewer-next"
        type="button"
        className={ui.action}
        aria-label={i18n.t("file.next")}
        title={i18n.t("file.next")}
        onClick={() => page("ArrowRight")}
      >
        {icons.next}
      </button>
    </div>
  );
}
