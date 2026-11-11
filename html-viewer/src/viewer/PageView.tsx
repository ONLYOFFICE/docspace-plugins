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

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { usePluginAPI, usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";

import { CodeView } from "../code/CodeView";
import { confirmDiscard } from "../file/confirm-discard";
import { change, discard, editOf, save, track, useEdits } from "../file/edits";
import { SaveButton } from "../file/SaveButton";
import type { HtmlFile } from "../file/useHtmlFile";
import { buildHtmlDocument } from "../html/document";
import { i18n } from "../locales";
import { DEVICES, devicesFor, type Device } from "../preview/devices";
import { PreviewFrame } from "../preview/PreviewFrame";
import { icons } from "../ui/icons";
import { isSaveKey } from "../ui/save-key";
import { Segmented } from "../ui/Segmented";
import ui from "../ui/ui.module.css";
import { CloseButton } from "./CloseButton";
import { CopyButton } from "./CopyButton";
import { useChromeless } from "./useChromeless";
import styles from "./viewer.module.css";

export type View = "preview" | "code";

/** One file: the toolbar, a conflict to settle, and the preview or the source. */
export function PageView({
  file,
  reload,
  view,
  device,
  onView,
  onDevice,
}: {
  file: HtmlFile;
  /** Reads the file again: after a conflict, to take what someone else saved. */
  reload: () => void;
  view: View;
  device: Device;
  onView: (view: View) => void;
  onDevice: (device: Device) => void;
}) {
  const api = usePluginAPI();
  const actions = usePluginActions();
  useEdits();
  // A fresh read may be newer than what this viewer last saw; an older one is ignored.
  useEffect(() => track(file), [file]);
  const edit = editOf(file);
  const text = edit.draft ?? edit.saved;
  const dirty = edit.draft !== undefined;

  // The outcome replaces the Save label for a moment; a toast may sit under the media viewer.
  const [outcome, setOutcome] = useState<"done" | "failed" | null>(null);
  useEffect(() => {
    if (!outcome) return;
    const timer = setTimeout(() => setOutcome(null), 2500);
    return () => clearTimeout(timer);
  }, [outcome]);
  // Typing again ends it at once: "Saved" over text that is not would mislead.
  useEffect(() => setOutcome(null), [text]);

  const run = async (overwrite = false) => {
    const result = await save(api, file, overwrite);
    if (result === "saved") setOutcome("done");
    else if (result === "failed") setOutcome("failed");
  };

  // After a conflict the file is read again, so what someone else saved takes the
  // draft's place. The conflict is read when the user confirms, before discard() clears it.
  const discardDraft = () =>
    confirmDiscard(actions, () => {
      const conflict = editOf(file).conflict;
      discard(file.fileId);
      if (conflict) reload();
    });

  // Ctrl+S anywhere on the page, not only in the code: with a draft it saves, where the
  // viewer would download the stored file instead. Without one the download stands.
  const keys = (e: KeyboardEvent) => {
    if (!dirty || !isSaveKey(e)) return;
    e.preventDefault();
    e.stopPropagation();
    run();
  };

  // Built only while the preview is on screen: the code view re-renders on every key.
  const built = useMemo(() => {
    if (view !== "preview") return undefined;
    try {
      return buildHtmlDocument(text);
    } catch {
      return null; // the source is still worth showing
    }
  }, [view, text]);
  const preview = view === "preview" && built !== null;
  const chromeless = useChromeless();

  // A device is offered only where its frame fits the card. One that does not is hidden
  // rather than squeezed - a phone frame on a phone is no preview - and the choice is
  // kept, so it comes back when the window is widened again.
  const toolbar = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  useLayoutEffect(() => {
    const element = toolbar.current!;
    const measure = () => setCardWidth(element.offsetWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure(); // before the first paint, so no frame flashes on a phone
    return () => observer.disconnect();
  }, []);
  const devices = devicesFor(cardWidth);
  const size = devices.find((d) => d.value === device) ?? DEVICES[0];

  return (
    <div className={styles.page} onKeyDown={keys}>
      <div id="html-viewer-toolbar" ref={toolbar} className={styles.toolbar}>
        <Segmented
          id="html-viewer-view"
          label={i18n.t("view.label")}
          value={preview ? "preview" : "code"}
          onChange={onView}
          options={[
            { value: "preview", label: i18n.t("view.preview"), icon: icons.eye },
            { value: "code", label: i18n.t("view.code"), icon: icons.code },
          ]}
        />
        {preview && devices.length > 1 && (
          <div className={styles.center}>
            <Segmented
              id="html-viewer-device"
              label={i18n.t("device.label")}
              value={size.value}
              onChange={onDevice}
              iconsOnly
              options={devices.map(({ value, width }) => ({
                value,
                label: i18n.t(`device.${value}`),
                title: width
                  ? `${i18n.t(`device.${value}`)} · ${width} px`
                  : i18n.t(`device.${value}`),
                icon: icons[value],
              }))}
            />
          </div>
        )}
        <div className={styles.end}>
          {dirty && !edit.saving && (
            <button
              id="html-viewer-discard"
              type="button"
              className={ui.action}
              aria-label={i18n.t("edit.discard")}
              title={i18n.t("edit.discard")}
              onClick={discardDraft}
            >
              {icons.undo}
            </button>
          )}
          {(dirty || edit.saving || outcome) && (
            <SaveButton state={edit.saving ? "saving" : outcome} onClick={() => run()} />
          )}
          <CopyButton source={text} />
          {chromeless && <CloseButton />}
        </div>
      </div>

      {edit.conflict && (
        <div id="html-viewer-conflict" className={ui.alert} role="alert">
          <span>{i18n.t("edit.conflict")}</span>
          <button
            id="html-viewer-overwrite"
            type="button"
            className={ui.action}
            onClick={() => run(true)}
          >
            {i18n.t("edit.overwrite")}
          </button>
          <button
            id="html-viewer-take-theirs"
            type="button"
            className={ui.action}
            onClick={discardDraft}
          >
            {i18n.t("edit.discard")}
          </button>
        </div>
      )}

      {preview && built ? (
        <PreviewFrame built={built} size={size} />
      ) : (
        <CodeView
          text={text}
          onChange={file.canEdit ? (next) => change(file, next) : undefined}
          onSave={() => run()}
        />
      )}
    </div>
  );
}
