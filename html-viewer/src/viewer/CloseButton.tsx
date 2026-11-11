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

import { canClose } from "../file/edits";
import { i18n } from "../locales";
import { icons } from "../ui/icons";
import ui from "../ui/ui.module.css";

/** Only where the viewer draws no close cross of its own. */
export function CloseButton() {
  const { closeMediaViewer } = usePluginActions();
  return (
    <button
      id="html-viewer-close"
      type="button"
      className={`${ui.action} ${ui.close}`}
      aria-label={i18n.t("close")}
      title={i18n.t("close")}
      // closeMediaViewer() skips onClose, so the unsaved check is made here.
      onClick={() => canClose() && closeMediaViewer()}
    >
      {icons.close}
    </button>
  );
}
