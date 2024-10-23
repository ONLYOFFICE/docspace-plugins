/*
 * (c) Copyright Ascensio System SIA 2024
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

import plugin from ".";

import {
  Actions,
  IMessage,
  PluginStatus,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

class AssemblyAI {
  apiURL = "";
  currentFileId: null | number = null;
  apiToken = "";
  constructor() {}

  createAPIUrl = () => {
    const api = plugin.getAPI();

    this.apiURL = api.origin.replace(/\/+$/, "");

    const params = [api.proxy, api.prefix];

    if (this.apiURL) {
      params.forEach((part) => {
        if (!part) return;
        const newPart = part.trim().replace(/^\/+/, "");
        this.apiURL += newPart
          ? this.apiURL.length > 0 &&
            this.apiURL[this.apiURL.length - 1] === "/"
            ? newPart
            : `/${newPart}`
          : "";
      });
    }
  };

  setAPIUrl = (url: string) => {
    this.apiURL = url;
  };

  getAPIUrl = () => {
    return this.apiURL;
  };

  setAPIToken = (apiToken: string) => {
    this.apiToken = apiToken;

    plugin.updateStatus(!!apiToken ? PluginStatus.active : PluginStatus.hide);
  };

  getAPIToken = () => {
    return this.apiToken;
  };

  setCurrentFileId = (id: number | null) => {
    this.currentFileId = id;
  };

  uploadFile = async (api_token: string, path: string, data: Blob) => {
    const url = "https://api.assemblyai.com/v2/upload";

    // Send a POST request to the API to upload the file, passing in the headers and the file data
    const response = await fetch(url, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/octet-stream",
        Authorization: api_token,
      },
    });

    // If the response is successful, return the upload URL
    if (response.status === 200) {
      const responseData = await response.json();
      return responseData["upload_url"];
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }
  };

  transcribeAudio = async (api_token: string, audio_url: string) => {
    // Set the headers for the request, including the API token and content type
    const headers = {
      authorization: api_token,
      "content-type": "application/json",
    };

    // Send a POST request to the transcription API with the audio URL in the request body
    const response = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      body: JSON.stringify({ audio_url }),
      headers,
    });

    // Retrieve the ID of the transcript from the response data
    const responseData = await response.json();
    const transcriptId = responseData.id;

    // Construct the polling endpoint URL using the transcript ID
    const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    // Poll the transcription API until the transcript is ready
    while (true) {
      // Send a GET request to the polling endpoint to retrieve the status of the transcript
      const pollingResponse = await fetch(pollingEndpoint, { headers });
      const transcriptionResult = await pollingResponse.json();

      // If the transcription is complete, return the transcript object
      if (transcriptionResult.status === "completed") {
        return transcriptionResult;
      }
      // If the transcription has failed, throw an error with the error message
      else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      }
      // If the transcription is still in progress, wait for a few seconds before polling again
      else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  };

  speechToText = async (id: number) => {
    if (!this.apiToken)
      return {
        actions: [Actions.showToast],
        toastProps: [{ type: ToastType.error, title: "API token is missing" }],
      } as IMessage;

    this.setCurrentFileId(null);

    if (!this.apiURL) this.createAPIUrl();
    try {
      const { viewUrl, title, folderId, fileExst } = (
        await (await fetch(`${this.apiURL}/files/file/${id}`)).json()
      ).response;

      const file = await fetch(viewUrl);

      const fileBlob = await file.blob();

      const upload_url = await this.uploadFile(
        this.apiToken,
        viewUrl,
        fileBlob
      );

      if (!upload_url)
        return {
          actions: [Actions.showToast],
          toastProps: [{ type: ToastType.error, title: "Wrong API token" }],
        } as IMessage;

      const transcript = await this.transcribeAudio(this.apiToken, upload_url);

      if (!transcript.text) {
        return {
          actions: [Actions.showToast],
          toastProps: [
            {
              type: ToastType.info,
              title: "Speech is not recognized or is missing",
            },
          ],
        } as IMessage;
      }

      const blob = new Blob([transcript.text], {
        type: "text/plain;charset=UTF-8",
      });

      const newFile = new File([blob], `blob`, {
        type: "",
        lastModified: new Date().getTime(),
      });

      const formData = new FormData();
      formData.append("file", newFile);

      const newTitle = `${title.replaceAll(fileExst, "")} text`;

      const sessionRes = await fetch(
        `${this.apiURL}/files/${folderId}/upload/create_session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            createOn: new Date(),
            fileName: `${newTitle}.txt`,
            fileSize: newFile.size,
            relativePath: "",
          }),
        }
      );

      const sessionData = (await sessionRes.json()).response.data;

      const res = await (await fetch(`${sessionData.location}`, {
        method: "POST",
        body: formData,
      })).json();
      const success = res.success;

      return {
        actions: [Actions.showToast],
        toastProps: [
          {
            type: success ? ToastType.success : ToastType.error,
            title: success 
              ? "The file was successfully converted to text"
              : `Conversion to text is not successful: ${res.message}`,
          },
        ],
      } as IMessage;
    } catch (e) {
      console.log(e);
      return {
        actions: [Actions.showToast],
        toastProps: [{ type: ToastType.error, title: "Wrong API token" }],
      } as IMessage;
    }
  };
}

const assemblyAI = new AssemblyAI();

export default assemblyAI;
