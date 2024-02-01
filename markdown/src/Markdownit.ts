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
  markdownitModalDialogProps, 
  saveButton, 
  editorBody, 
  mdArea, 
  saveExitButton, 
  toastProps, 
  errorToast,
  markdownResize, 
  editorBox, 
  markdownSide, 
  intendBox, 
  previewSide, 
  previewResize, 
  viewerBody 
} from "./MarkdownIT/Dialog";
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import properties from "./properties.json";
import {
  Actions,
  Components,
  IMessage,
  IToast,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import { closeButton, saveUnsavedButton, unsavedModalDialog } from "./MarkdownIT/Unsaved";

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return '';
  }
});

class Markdownit {
  apiURL: string = "";
  currentFileId: number | null = null;
  saveRequestRunning:boolean = false;
  currentFolderId: number | null = null;
  fulscreen: boolean = false;
  fileChanged: boolean = false;
  
  setCurrentFolderId = (id: number | null) => {
    this.currentFolderId = id;
  };

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

  createNewFile = async (value: string) => {
    if (!this.apiURL) this.createAPIUrl();

    const blob = new Blob([" "]);
    const file = new File([blob], `blob`, {
      type: "",
      lastModified: new Date().getTime(),
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const sessionRes = await fetch(
        `${this.apiURL}/files/${this.currentFolderId}/upload/create_session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            createOn: new Date(),
            fileName: `${value}.md`,
            fileSize: file.size,
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
  };

  editMarkdown = async (id: number, view: boolean) => {
    if (!this.apiURL) this.createAPIUrl();

    const file = (await (await fetch(`${this.apiURL}/files/file/${id}`)).json())
    .response;

    if (file.fileExst !== ".md") {
    return {
      actions: [Actions.showToast],
      toastProps: [
      { type: ToastType.error, title: "Wrong file format" } as IToast,
      ],
    };
    }

    const userRes = (await (await fetch(`${this.apiURL}/people/@self`)).json())
    .response;

    const { isVisitor, theme } = userRes;

    const { access, title } = file;

    const showSaveButton =
    !isVisitor &&
    (access === 0 || access === 1 || access === 10 || access === 11);

    this.currentFileId = file.id;

    const data = await fetch(file.viewUrl);

    const dataBlob = await data.blob();

    const dataText = await dataBlob.text();
    
    this.fulscreen = false;

    if(!showSaveButton || view){
      const message = this.openViewer(
        dataText,
        title,
      );
  
      return message;
    } else {
      const message = this.openEditor(
        dataText,
        title,
      );
  
      return message;
    }
  }

  openViewer = (
    data: string,
    title: string,
  ): IMessage => {
    
    markdownitModalDialogProps.dialogHeader = title;
    markdownitModalDialogProps.dialogBody = viewerBody;
    markdownitModalDialogProps.onLoad = async () => {
      
      incorrectSolution(data);

      return {
        newDialogBody: markdownitModalDialogProps.dialogBody,
        newDialogHeader: title
      };
    }
    adaptive(false);
    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: markdownitModalDialogProps,
    };

    return message;
  };

  openEditor = (
    data: string,
    title: string,
  ): IMessage => {
    saveExitButton.onClick = async () => {
      let success = await this.saveMarkdown(mdArea.value);
      if (success) {
        this.stopEdit();
        var message: IMessage = {
          actions: [Actions.closeModal, Actions.showToast],
          toastProps: [toastProps],
        }
        this.fileChanged = false;
      } else {
        message = {
          actions: [Actions.showToast],
          toastProps: [errorToast]
        }
      }
      return message;
    }
    saveButton.onClick =async () => {
      let success = await this.saveMarkdown(mdArea.value);
      if (success) {
        saveButton.isDisabled = true;
        var message: IMessage = {
          actions: [Actions.updateProps, Actions.updateContext, Actions.showToast],
          newProps: saveButton,
          toastProps: [toastProps],
          contextProps: [
            {
              "name": "saveExitButton",
              "props":{
                ...saveExitButton,
                "isDisabled": true
              }
            },
          ]
        }
        this.fileChanged = false;
      } else {
        message = {
          actions: [Actions.showToast],
          toastProps: [errorToast],
        }
      }
      
      return message;
    }
    mdArea.value = data;
    mdArea.onChange = (value: string) => {
      this.fileChanged = true;
      mdArea.value = value;
      if (saveButton.isDisabled){
        var message: IMessage = {
          "actions": [Actions.updateProps, Actions.updateContext],
          "newProps": mdArea,
          "contextProps": [
            {
              "name": "saveExitButton",
              "props":{
                ...saveExitButton,
                "isDisabled": false
              }
            },
            {
              "name": "saveButton",
              "props": {
                ...saveButton,
                "isDisabled": false
              }
            },
          ]
        };
      } else {
        message = {
          "actions": [Actions.updateProps],
          "newProps": mdArea,
        }
      }
      
      updateMD(value);
      return message;
    };
    markdownResize.onClick = () => {
      resizeTextArea();
      if (this.fulscreen) {
        markdownSide.widthProp = "50%";
        editorBox.children = [
          {
            component: Components.box,
            props: markdownSide
          },
          {
            component: Components.box,
            props: intendBox
          },
          {
            component: Components.box,
            props: previewSide
          }
        ]
        var message: IMessage = {
          actions: [Actions.updateContext],
          contextProps: [
            {
              name: "editorBox",
              props: editorBox
            },
            {
              name: "markdownSide",
              props: markdownSide
            }
          ]
        }
        this.fulscreen = false;
        let currentData = mdArea.value;
        incorrectSolution(currentData);
        return message;
      } else {
        markdownSide.widthProp = "100%";
        editorBox.children = [
          {
            component: Components.box,
            props: markdownSide
          }
        ]
        var message: IMessage = {
          actions: [Actions.updateContext],
          contextProps: [
            {
              name: "editorBox",
              props: editorBox
            },
            {
              name: "markdownSide",
              props: markdownSide
            }
          ]
        }
        this.fulscreen = true;
        return message;
      }
    }
    previewResize.onClick = () => {
      if (this.fulscreen) {
        previewSide.widthProp = "50%";
        editorBox.children = [
          {
            component: Components.box,
            props: markdownSide
          },
          {
            component: Components.box,
            props: intendBox
          },
          {
            component: Components.box,
            props: previewSide
          }
        ]
        var message: IMessage = {
          actions: [Actions.updateContext],
          contextProps: [
            {
              name: "editorBox",
              props: editorBox
            },
            {
              name: "previewSide",
              props: previewSide
            }
          ]
        }
        this.fulscreen = false;
        let currentData = mdArea.value;
        incorrectSolution(currentData);
        return message;
      } else {
        previewSide.widthProp = "100%";
        editorBox.children = [
          {
            component: Components.box,
            props: previewSide
          }
        ]
        var message: IMessage = {
          actions: [Actions.updateContext],
          contextProps: [
            {
              name: "editorBox",
              props: editorBox
            },
            {
              name: "previewSide",
              props: previewSide
            }
          ]
        }
        this.fulscreen = true;
        let currentData = mdArea.value;
        incorrectSolution(currentData);
        return message;
      }
    }
    closeButton.onClick = unsavedModalDialog.onClose = () => {
      const message: IMessage = {
          actions: [Actions.closeModal],
      };
      this.fileChanged = false;
      return message;
    }
    saveUnsavedButton.onClick = async () => {
      let success = await this.saveMarkdown(mdArea.value);
      if (success) {
        this.stopEdit();
        var message: IMessage = {
          actions: [Actions.closeModal, Actions.showToast],
          toastProps: [toastProps],
        }
        this.fileChanged = false;
      } else {
        message = {
          actions: [Actions.showToast],
          toastProps: [errorToast]
        }
      }
      return message;
    }
    previewSide.widthProp = "50%";
    markdownSide.widthProp = "50%";
    editorBox.children = [
      {
        component: Components.box,
        props: markdownSide
      },
      {
        component: Components.box,
        props: intendBox
      },
      {
        component: Components.box,
        props: previewSide
      }
    ]
    // syncScroll.onChange = () => {
    //   if (syncScroll.isChecked) scrollSync(false);
    //   else scrollSync(true);
    //   var message: IMessage = {
    //     actions: [Actions.updateProps],
    //     newProps: {...syncScroll, isChecked: !syncScroll.isChecked}
    //   }
    //   return message;
    // }
    markdownitModalDialogProps.dialogHeader = title;
    markdownitModalDialogProps.dialogBody = editorBody;
    markdownitModalDialogProps.onClose = () => {
      const message: IMessage = {
        actions: [Actions.closeModal],
      };
      if (this.fileChanged) {
        message.actions?.push(Actions.showModal);
        message.modalDialogProps = unsavedModalDialog
      }
      return message;
    }
    markdownitModalDialogProps.onLoad = async () => {
        
      incorrectSolution(data);

      return {
        newDialogBody: markdownitModalDialogProps.dialogBody,
        newDialogHeader: title,
      };
    }
    adaptive(true);
    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: markdownitModalDialogProps,
    };
  
    return message;
  };

  saveMarkdown = async (data: string) => {
    if (this.saveRequestRunning) return;

    this.saveRequestRunning = true;
    let blob = new Blob([data]);

    const file = new File([blob], `blob`, {
      type: "",
      lastModified: new Date().getTime(),
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`${this.apiURL}/files/${this.currentFileId}/update`, {
        method: "PUT",
        body: formData,
      });
      this.saveRequestRunning = false;
      return true;
    } catch (e) {
      this.saveRequestRunning = false;
      console.log(e);
      return false;
    }
  }

  stopEdit = () => {
    this.currentFileId = null;
  };
};

async function insertMD (data: string) {
    const iframe = window.parent.document.getElementById("md-iframe") as HTMLIFrameElement;
    changeIFrameMinHeight();
    if (iframe){
    const result = md.render(data);
    let iframeWindow = iframe.contentWindow as Window;

    let hlStyles = iframeWindow.document.createElement("link");
    hlStyles.rel = "stylesheet";
    hlStyles.href = properties.hlstyles_url;
    let styles = iframeWindow.document.createElement("link");
    styles.rel = "stylesheet";
    styles.href = properties.styles_url;
    let bodyStyle = iframeWindow.document.createElement("style");
    bodyStyle.innerHTML = properties.bodystyle;
    iframeWindow.document.head.appendChild(hlStyles);
    iframeWindow.document.head.appendChild(styles);
    iframeWindow.document.head.appendChild(bodyStyle);

    linkControl(iframeWindow);

    let mdBody = iframeWindow.document.createElement("div");
    mdBody.id = "markdown-body";
    mdBody.innerHTML = result;
    iframeWindow.document.body.appendChild(mdBody);
    iframe.style.height = iframe.contentWindow?.document.documentElement.scrollHeight + 'px';
    setTimeout(function() {
      iframe.style.height = iframe.contentWindow?.document.documentElement.scrollHeight + 'px';
    }, 200);
  } 
  else {
    setTimeout(function() {
      insertMD(data);
    }, 50);
  }
}

function updateMD (data: string){
  const iframe = window.parent.document.getElementById("md-iframe") as HTMLIFrameElement;
  if (iframe){
    let body = iframe.contentWindow?.document.getElementById("markdown-body");
    if (body){
      let result = md.render(data);
      body.innerHTML = result;
      iframe.style.height = iframe.contentWindow?.document.documentElement.scrollHeight + 'px';
    }
  }
}

function scrollSync (enable: boolean){
  let scrolls = window.parent.document.querySelectorAll(".scroller");
  const area = scrolls[scrolls.length-1] as HTMLDivElement;
  let iframe = window.parent.document.getElementById("md-iframe") as HTMLIFrameElement;
  const body = iframe.contentWindow?.document.body as HTMLBodyElement;
  
  if (area && body){
    let areaScroll = function () {
      const scrollPercentage = area.scrollTop / (area.scrollHeight - area.clientHeight);
      body.scrollTop = scrollPercentage * (body.scrollHeight - body.clientHeight);
    }
    let iframeScroll = function () {
      const scrollPercentage = body.scrollTop / (body.scrollHeight - body.clientHeight);
      area.scrollTop = scrollPercentage * (area.scrollHeight - area.clientHeight);
      console.log(scrollPercentage)
    }
    if(enable){
      area.addEventListener('scroll', areaScroll);
      body.addEventListener('scroll', iframeScroll);
    } else {
      area.removeEventListener("scroll", areaScroll);
      body.removeEventListener("scroll", iframeScroll);
    }
  }
}

function linkControl(iFrameWindow: Window){
  const iframeDocument = iFrameWindow.document;
  iframeDocument.addEventListener('click', function(event) {
    let element = event.target as HTMLAnchorElement;
    if (element.tagName === 'A'){
      iFrameWindow.open(element.href, '_blank');
      event.preventDefault();
    }
  });
}

function adaptive(editor:boolean){
  mdArea.heightTextArea = window.parent.innerHeight * properties.textarea_height; // TODO: wait for string in sdk
  if(editor){
    editorBody.widthProp = window.parent.innerWidth * properties.modal_width + "px";
    editorBody.heightProp = window.parent.innerHeight * properties.modal_height + "px";
  } else {
    viewerBody.widthProp = window.parent.innerWidth * properties.modal_width + "px";
    viewerBody.heightProp = window.parent.innerHeight * properties.modal_height + "px";
  }
}

function resizeTextArea(){ // TODO: ask docspace developers for remove textarea maxwidth
  const area = window.parent.document.getElementsByName("md-plugin-textarea")[0] as HTMLIFrameElement;
  //@ts-ignore
  area.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.style.maxWidth = "100%";
}

function changeIFrameMinHeight(){ // TODO: remove after docspace 2.0.2 release
  const iframe = window.parent.document.getElementById("md-iframe") as HTMLIFrameElement;
  iframe.style.minHeight = "0";
}

function incorrectSolution(data:string){
  setTimeout(function(){
    insertMD(data)
  },200)
}

const markdownIt = new Markdownit();

export default markdownIt;