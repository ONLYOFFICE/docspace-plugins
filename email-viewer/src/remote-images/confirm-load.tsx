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
 * Asks before images from the internet are loaded: the request for them can tell the
 * sender that the message was opened, and that cannot be taken back. The portal draws the
 * dialog, over the media viewer, as it draws its own. A modal component gets no props,
 * so the answer reaches the caller through the closure the body is made in.
 */
export function confirmLoad(actions: PluginActions, onLoad: () => void): void {
  function Body() {
    return (
      <div
        id="email-viewer-load-dialog"
        style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}
      >
        <Text fontSize="13px">{i18n.t("images.loadWarning")}</Text>
        {/* Two equal halves across the dialog, as in the portal's own. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Button
            id="email-viewer-load-confirm"
            label={i18n.t("images.loadButton")}
            primary
            scale
            size={ButtonSize.normal}
            onClick={() => {
              actions.closeModal();
              onLoad();
            }}
          />
          <Button
            id="email-viewer-load-cancel"
            label={i18n.t("images.cancel")}
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
    dialogHeader: i18n.t("images.loadQuestion"),
    dialogBodyComponent: Body,
    autoMaxHeight: true,
  });
}
