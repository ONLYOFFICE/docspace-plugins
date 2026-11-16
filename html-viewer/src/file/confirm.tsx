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
import { ModalDisplayType } from "@onlyoffice/docspace-plugin-sdk";
import type { PluginActions } from "@onlyoffice/docspace-plugin-sdk/react";

import { i18n } from "../locales";

/**
 * A question before unsaved lines are lost, with nothing to bring them back. The portal
 * draws the dialog, over the media viewer, as it draws its own. A modal component gets
 * no props, so the answer reaches the caller through the closure the body is made in.
 */
function ask(
  actions: PluginActions,
  id: string,
  header: string,
  text: string,
  label: string,
  onConfirm: () => void,
): void {
  function Body() {
    return (
      <div
        id={`${id}-dialog`}
        style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}
      >
        <Text fontSize="13px">{text}</Text>
        {/* Two equal halves across the dialog, as in the portal's own. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Button
            id={`${id}-confirm`}
            label={label}
            primary
            scale
            size={ButtonSize.normal}
            onClick={() => {
              actions.closeModal();
              onConfirm();
            }}
          />
          <Button
            id={`${id}-keep`}
            label={i18n.t("edit.keep")}
            scale
            size={ButtonSize.normal}
            onClick={() => actions.closeModal()}
          />
        </div>
      </div>
    );
  }

  actions.showModal({
    displayType: ModalDisplayType.modal,
    dialogHeader: header,
    dialogBodyComponent: Body,
    autoMaxHeight: true,
  });
}

/** Before the undo button throws the file's draft away. */
export const confirmDiscard = (actions: PluginActions, onDiscard: () => void): void =>
  ask(
    actions,
    "html-viewer-discard",
    i18n.t("edit.discard"),
    i18n.t("edit.discardConfirm"),
    i18n.t("edit.discardButton"),
    onDiscard,
  );

/** Before a close over unsaved edits, in any file of the viewer, goes ahead. */
export const confirmClose = (actions: PluginActions, onClose: () => void): void =>
  ask(
    actions,
    "html-viewer-unsaved",
    i18n.t("edit.closeAnyway"),
    i18n.t("edit.unsaved"),
    i18n.t("close"),
    onClose,
  );
