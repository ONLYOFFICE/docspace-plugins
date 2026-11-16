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

import { useCurrentFile } from "@onlyoffice/docspace-plugin-sdk/react";

import { useShareLink, TShareTarget } from "./useShareLink";
import { useCopyLink } from "./useCopyLink";
import { QrCodeView } from "./QrCodeView";

export function QrInfoPanelTab() {
  const file = useCurrentFile();
  const copyLink = useCopyLink();

  const kind: TShareTarget["kind"] = file?.isFolder || file?.isRoom ? "folder" : "file";
  const target: TShareTarget | null = file ? { id: file.id, kind, isRoom: !!file.isRoom } : null;
  const { state, create, retry } = useShareLink(target);

  return (
    <QrCodeView
      state={state}
      isRoom={!!target?.isRoom}
      onCopy={copyLink}
      onCreate={create}
      onRetry={retry}
    />
  );
}
