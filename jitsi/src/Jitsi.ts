/*
 * (c) Copyright Ascensio System SIA 2025
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
import { Actions, IMessage, IToast, ToastType, File } from "@onlyoffice/docspace-plugin-sdk";
import { jitsiModalDialogProps, dialogBody } from "./Dialog";

class JitsiPlugin {
  apiURL: string = "";
  appID: string = "";
  currentRoomId: number | null = null;
  currentFolder: any = null;

  createAPIUrl = () => {
    const api = plugin.getAPI();

    this.apiURL = api.origin.replace(/\/+$/, "");

    const params = [api.proxy, api.prefix];

    if (this.apiURL) {
      params.forEach((part) => {
        if (!part) return;
        const newPart = part.trim().replace(/^\/+/, "");
        this.apiURL += newPart
          ? this.apiURL.length > 0 && this.apiURL[this.apiURL.length - 1] === "/"
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

  setAppID = (appID: string) => {
    this.appID = appID;
  };

  getAppID = () => {
    return this.appID;
  };

  generateJitsiFrameApiSrc = () => {
    if (this.appID) return `https://8x8.vc/${this.appID}/external_api.js`;
    return "https://meet.jit.si/external_api.js";
  };

  generateRoomName = () => {
    if (this.appID) return `${this.appID}/${this.currentRoomId}`;
    return `${this.currentFolder.current.title} room ${this.currentRoomId}${window.parent.location.hostname}`;
  };

  generateJitsiDomain = () => {
    if (this.appID) return "8x8.vc";
    return "meet.jit.si";
  };

  handleEvent = (e?: any) => {
    switch (e.data.action) {
      case "closeModal":
        return {
          actions: [Actions.closeModal],
        }
    }
  }

  openJitsi = async (id: number) => {
    if (!this.apiURL) this.createAPIUrl();

    this.currentFolder = (await (await fetch(`${this.apiURL}/files/${id}`)).json()).response;
    this.currentRoomId = id;

    jitsiModalDialogProps.dialogHeader = this.currentFolder.current.title + " room meeting";

    jitsiModalDialogProps.eventListeners = [
      {
        name: "message",
        onAction: this.handleEvent,
      },
    ];

    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: jitsiModalDialogProps,
    };

    this.setupIframe();

    return message;
  };

  setupIframe = () => {
    const iFrame = window.parent.document.getElementById("jitsi-plugin-iframe") as HTMLIFrameElement;
    if (!iFrame) {
      setTimeout(() => {
        this.setupIframe();
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.src = this.generateJitsiFrameApiSrc();
    iFrame.contentWindow!.document.head.appendChild(script);

    iFrame.contentWindow!.document.body.style.margin = "0";

    iFrame.setAttribute(  // TODO: fix
      "allow",
      "autoplay; camera; clipboard-write; compute-pressure; display-capture; hid; microphone; screen-wake-lock; speaker-selection"
    );

    this.createJitsiApi(iFrame);
  };

  createJitsiApi = async (iFrame: HTMLIFrameElement) => {
    // @ts-ignore
    const JitsiMeetExternalAPI = iFrame.contentWindow!.JitsiMeetExternalAPI;
    if (!JitsiMeetExternalAPI) {
      setTimeout(() => {
        this.createJitsiApi(iFrame);
      }, 50);
      return;
    }

    const userRes = (await (await fetch(`${this.apiURL}/people/@self`)).json()).response;

    const options = {
      parentNode: iFrame.contentWindow!.document.body,
      roomName: this.generateRoomName(),
      userInfo: {
        displayName: userRes.displayName,
        email: userRes.email,
      },
      width: "100%",
      height: "100%",
    };

    const api = new JitsiMeetExternalAPI(this.generateJitsiDomain(), options);

    api.on("videoConferenceLeft", () => {
      iFrame.contentWindow?.parent.postMessage({
        action: "closeModal",
      }, "*");
    });
  };
}

export const jitsi = new JitsiPlugin();
