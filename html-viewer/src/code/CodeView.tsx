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

import { useMemo, type KeyboardEvent } from "react";

import { highlight } from "../html/highlight";
import { i18n } from "../locales";
import { isSaveKey } from "../ui/save-key";
import styles from "./code.module.css";

// Past this size the source is shown and edited as plain text: colouring it again on
// every key would cost more than a frame, and a textarea alone stays fast at any size.
const PLAIN_TEXT = 100_000;

/**
 * The source. Highlighted, and where the user may write the file a transparent textarea
 * lies over the coloured lines with the same font, padding and wrapping, so the caret and
 * the selection fall on the text below. Past PLAIN_TEXT, or where colouring fails, it is
 * plain text: read in a <pre>, edited in the textarea alone.
 */
export function CodeView({
  text,
  onChange,
  onSave,
}: {
  text: string;
  onChange?: (text: string) => void;
  onSave: () => void;
}) {
  // Highlighted only once the source is asked for; most files are only ever previewed.
  const html = useMemo(() => {
    if (text.length > PLAIN_TEXT) return null;
    try {
      return highlight(text);
    } catch {
      return null; // a source the highlighter cannot take is still worth reading
    }
  }, [text]);

  const keys = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Keys typed into the code are the editor's: the viewer would page on the arrows and
    // start deleting the file on Delete. Escape still closes - over an unsaved edit the
    // viewer stays open anyway and says why.
    if (e.key !== "Escape") e.stopPropagation();
    if (isSaveKey(e)) {
      e.preventDefault();
      onSave();
    } else if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      // execCommand keeps the native undo history, which setting the value would wipe.
      document.execCommand("insertText", false, "  ");
    }
  };

  // One tree in both modes, the textarea always second: a paste across PLAIN_TEXT only
  // changes its class, and its focus, caret and undo history stay.
  return (
    <div
      id="html-viewer-code"
      className={styles.code}
      data-plain={html === null ? "" : undefined}
      dir="ltr"
    >
      <div className={styles.lines}>
        {html === null ? (
          !onChange && <pre className={styles.plainText}>{text}</pre>
        ) : (
          /* Every character of the source is escaped by highlight(); only its own spans are markup. */
          <pre
            className={styles.source}
            aria-hidden={onChange ? true : undefined}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        {onChange && (
          <textarea
            id="html-viewer-editor"
            className={html === null ? styles.plainInput : styles.input}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={keys}
            aria-label={i18n.t("edit.label")}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        )}
      </div>
    </div>
  );
}
