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

import type { PluginAPIClient } from "@onlyoffice/docspace-plugin-sdk/react";

import type { EmailAttachment } from "../email/types";

type UploadSession = {
  data?: { location?: string };
  location?: string;
  response?: { data?: { location?: string } };
};

/**
 * Writes one attachment into a folder: a chunked-upload session, then the bytes to the
 * location it returns. `onProgress` gets the bytes sent so far.
 */
export async function uploadAttachment(
  api: PluginAPIClient,
  folderId: number | string,
  attachment: EmailAttachment,
  onProgress: (sent: number) => void,
): Promise<void> {
  const location = await createUploadLocation(api, folderId, attachment);
  await sendBytes(location, attachment, onProgress);
}

/** The envelope differs between the api client and a raw response, hence three places. */
async function createUploadLocation(
  api: PluginAPIClient,
  folderId: number | string,
  attachment: EmailAttachment,
): Promise<string> {
  const session = await api.post<UploadSession>(`/files/${folderId}/upload/create_session`, {
    createOn: new Date().toISOString(),
    fileName: attachment.name,
    fileSize: attachment.size,
    createNewIfExist: true,
  });
  const location =
    session?.data?.location ?? session?.location ?? session?.response?.data?.location;
  if (!location) throw new Error("Upload session returned no location");
  return location;
}

/**
 * The location is a full URL on the portal, sent with the session cookie.
 * XMLHttpRequest rather than fetch: only it reports how much has been sent, which is what
 * keeps the progress moving inside one large attachment.
 */
function sendBytes(
  location: string,
  attachment: EmailAttachment,
  onProgress: (sent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", location);
    xhr.withCredentials = true;
    xhr.upload.onprogress = (e) => onProgress(Math.min(e.loaded, attachment.size));
    xhr.onerror = () => reject(new Error("Upload failed: network error"));
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`Upload failed: HTTP ${xhr.status}`));
        return;
      }
      // The chunked uploader can answer 200 with { success: false } on a refused write.
      try {
        if (JSON.parse(xhr.responseText)?.success === false) {
          reject(new Error("Upload refused"));
          return;
        }
      } catch {
        // not JSON: the status already said it went through
      }
      resolve();
    };
    const form = new FormData();
    form.append(
      "file",
      new File([attachment.content as BlobPart], attachment.name, { type: attachment.mimeType }),
    );
    xhr.send(form);
  });
}
