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

import { SelectorType, ToastType } from "@onlyoffice/docspace-plugin-sdk";
import type { PluginActions, PluginAPIClient } from "@onlyoffice/docspace-plugin-sdk/react";

import { i18n } from "../locales";

export type Folder = { id: number | string; title: string };

type FolderInfo = { title?: string; security?: { Create?: boolean } };

/**
 * The portal's own folder picker, opened on `startFolderId`; resolves with the folder,
 * or null when the user leaves it. Select is gated on the folder being browsed; whether
 * files may be added there is only known from the folder itself, so onSubmit asks and
 * keeps the picker open on a refusal. It opens over the media viewer: the kit's dialog
 * sits at z-index 310, the plugin viewer at 300.
 */
export function pickFolder(
  actions: PluginActions,
  api: PluginAPIClient,
  startFolderId: number | string | null,
): Promise<Folder | null> {
  return new Promise((resolve) => {
    let done = false;
    const finish = (value: Folder | null) => {
      if (done) return;
      done = true;
      resolve(value);
      actions.closeSelector();
    };
    const cancel = () => finish(null);

    actions.showSelector({
      type: SelectorType.Files,
      props: {
        withHeader: true,
        headerProps: {
          label: i18n.t("attachments.chooseFolder"),
          isCloseable: true,
          onCloseClick: cancel,
        },
        withBreadCrumbs: true,
        withSearch: true,
        withCreate: true,
        currentFolderId: startFolderId ?? undefined,
        submitButtonLabel: i18n.t("attachments.saveHere"),
        withCancelButton: true, // the portal labels it "Cancel" in the user's language
        onCancel: cancel, // the cancel button and the header cross
        onClose: cancel, // a click on the backdrop
        getIsDisabled: ({ isFirstLoad, selectedItemId, selectedItemType }) =>
          isFirstLoad || !selectedItemId || selectedItemType === "rooms",
        onSubmit: async ({ selectedItemId, folderTitle }) => {
          if (selectedItemId === undefined) return;
          let title = folderTitle;
          try {
            const folder = await api.get<FolderInfo>(`/files/folder/${selectedItemId}`);
            if (folder?.security?.Create !== true) {
              actions.showToast({ type: ToastType.warning, title: i18n.t("attachments.noRights") });
              return;
            }
            title = folder.title || folderTitle;
          } catch {
            // The folder could not be read: let the upload itself say whether it may write.
          }
          finish({ id: selectedItemId, title });
        },
      },
    });
  });
}
