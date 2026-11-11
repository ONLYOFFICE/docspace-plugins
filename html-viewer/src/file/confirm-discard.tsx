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
 * Asks before a draft is thrown away: one click would lose every unsaved line, with
 * nothing to bring them back. The portal draws the dialog, over the media viewer, as it
 * draws its own. A modal component gets no props, so the answer reaches the caller
 * through the closure the body is made in.
 */
export function confirmDiscard(actions: PluginActions, onDiscard: () => void): void {
  function DiscardBody() {
    return (
      <div
        id="html-viewer-discard-dialog"
        style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}
      >
        <Text fontSize="13px">{i18n.t("edit.discardConfirm")}</Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Button
            id="html-viewer-discard-confirm"
            label={i18n.t("edit.discardButton")}
            primary
            size={ButtonSize.normal}
            onClick={() => {
              actions.closeModal();
              onDiscard();
            }}
          />
          <Button
            id="html-viewer-discard-keep"
            label={i18n.t("edit.keep")}
            size={ButtonSize.normal}
            onClick={() => actions.closeModal()}
          />
        </div>
      </div>
    );
  }

  actions.showModal({
    displayType: ModalDisplayType.modal,
    dialogHeader: i18n.t("edit.discard"),
    dialogBodyComponent: DiscardBody,
    autoMaxHeight: true,
  });
}
