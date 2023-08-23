import plugin from ".";

import {
  Actions,
  IMessage,
  PluginStatus,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

const API_TOKEN = "a8f99f2bb23b45e8b7bd1d06a30c9a59";

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
  };

  getAPIToken = () => {
    return this.apiToken;
  };

  fetchAPIToken = async () => {
    const apiToken = localStorage.getItem("speech-to-text-api-token");

    if (!apiToken) return;

    this.setAPIToken(apiToken);
    plugin.updateStatus(PluginStatus.active);
  };

  saveAPIToken = (apiToken: string) => {
    localStorage.setItem("speech-to-text-api-token", apiToken);
    plugin.updateStatus(
      !!apiToken ? PluginStatus.active : PluginStatus.pending
    );
  };

  setCurrentFileId = (id: number | null) => {
    this.currentFileId = id;
  };

  uploadFile = async (api_token: string, path: string, data: Blob) => {
    console.log(`Uploading file: ${path}`);

    const url = "https://api.assemblyai.com/v2/upload";

    try {
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
    } catch (error) {
      console.error(`Error: ${error}`);
      return null;
    }
  };

  transcribeAudio = async (api_token: string, audio_url: string) => {
    console.log("Transcribing audio... This might take a moment.");

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
    if (!this.apiToken) {
      const message: IMessage = {
        actions: [Actions.showSettingsModal],
      };

      this.setCurrentFileId(id);

      return message;
    }

    this.setCurrentFileId(null);

    if (!this.apiURL) this.createAPIUrl();

    const { viewUrl, title, folderId, fileExst } = (
      await (await fetch(`${this.apiURL}/files/file/${id}`)).json()
    ).response;

    const file = await fetch(viewUrl);

    const fileBlob = await file.blob();

    const upload_url = await this.uploadFile(this.apiToken, viewUrl, fileBlob);

    const transcript = await this.transcribeAudio(this.apiToken, upload_url);

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

    try {
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

      const data = await fetch(`${sessionData.location}`, {
        method: "POST",
        body: formData,
      });

      const { id: fileId } = (await data.json()).data;

      return fileId;
    } catch (e) {
      console.log(e);
    }

    return {
      actions: [Actions.showToast],
      toastProps: [{ type: ToastType.success, title: "" }],
    } as IMessage;
  };
}

const assemblyAI = new AssemblyAI();

export default assemblyAI;
