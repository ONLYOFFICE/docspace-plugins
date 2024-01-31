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

import properties from "../properties.json";
import {
  Actions,
  ButtonSize,
  Components,
  IBorderProp,
  IBox,
  IButton,
  IFrame,
  IMessage,
  IModalDialog,
  IText,
  ITextArea,
  IToast,
  IToggleButton,
  ModalDisplayType,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";

export const toastProps: IToast = {
  type: ToastType.success,
  title: "File saved"
}

export const errorToast: IToast = {
  type: ToastType.error,
  title: "File not saved"
}

export const intendBox: IBox = {
  widthProp: "10px",
  heightProp: "10px"
}

const marginBox: IBox = {
  widthProp: "1px",
  heightProp: "1px",
  marginProp: "0 auto"
}

export const saveExitButton: IButton = {
  label: "Save and close",
  size: ButtonSize.normal,
  isDisabled:  true,
  primary: false,
  withLoadingAfterClick: true,
  disableWhileRequestRunning: true,
  scale: true,
  onClick: () => {}
}

export const saveButton: IButton = {
  label: "Save",
  size: ButtonSize.normal,
  isDisabled: true,
  primary: true,
  withLoadingAfterClick: true,
  disableWhileRequestRunning: true,
  scale: true,
  onClick: () => {}
}

export const syncScroll: IToggleButton = {
  label: "ScrollSync",
  isChecked: false,
  onChange: () => {}
}

export const editorFooter: IBox = {
  widthProp: "30%",
  marginProp: "-5px 0 0 0",
  displayProp: "flex",
  flexDirection: "row",
  children: [
    {
      component: Components.button,
      props: saveButton,
      contextName: "saveButton"
    },
    {
      component: Components.box,
      props: {...intendBox, widthProp: "24px"}
    },
    {
      component: Components.button,
      props: saveExitButton,
      contextName: "saveExitButton"
    },
    // {
    //   component: Components.box,
    //   props: intendBox
    // },
    // {
    //   component: Components.toggleButton,
    //   props: syncScroll
    // }
  ]
}

export const mdArea: ITextArea = {
  name: "md-plugin-textarea",
  heightTextArea: window.parent.innerHeight * properties.textarea_height,
  value: "",
  hasNumeration: false,
  onChange: ()=>{}
}

const areaBox: IBox = {
  widthProp: "100%",
  heightProp: "100%",
  children:[
    {
      component: Components.textArea,
      props: mdArea
    }
  ]
}

const markdownText: IText = {
  text: "Markdown",
  fontSize: "14px",
  fontWeight: 700
}

export const markdownResize: IButton = {
  label: "Resize",
  size: ButtonSize.extraSmall,
  onClick: () => {}
}

const markdownHeader: IBox = {
  displayProp: "flex",
  flexDirection: "row",
  children: [
    {
      component: Components.text,
      props: markdownText
    },
    {
      component: Components.box,
      props: marginBox
    },
    {
      component: Components.button,
      props: markdownResize
    }
  ]
}

export const markdownSide: IBox = {
  widthProp: "50%",
  heightProp: "100%",
  children: [
    {
      component: Components.box,
      props: markdownHeader
    },
    {
      component: Components.box,
      props: intendBox
    },
    {
      component: Components.box,
      props: areaBox
    }
  ]
}

const frameProps: IFrame = {
  width: "100%",
  height: "auto",
  name: "md-viewer",
  id: "md-iframe",
  src: "",
}

const borderProp: IBorderProp = {
  color: "rgb(208, 213, 218)",
  radius: "3px",
  width: "1px",
  style: "solid"
}

const iframeBox: IBox = {
  widthProp: "100%",
  heightProp: "100%",
  overflowProp: "auto",
  borderProp: borderProp,
  children: [
    {
      component: Components.iFrame,
      props: frameProps
    }
  ]
}

const previewText: IText = {
  text: "Preview",
  fontSize: "14px",
  fontWeight: 700
}

export const previewResize: IButton = {
  label: "Resize",
  size: ButtonSize.extraSmall,
  onClick: () => {}
}

const previewHeader: IBox = {
  displayProp: "flex",
  flexDirection: "row",
  children: [
    {
      component: Components.text,
      props: previewText
    },
    {
      component: Components.box,
      props: marginBox
    },
    {
      component: Components.button,
      props: previewResize
    }
  ]
}

export const previewSide: IBox = {
  widthProp: "50%",
  heightProp: "94%",
  children: [
    {
      component: Components.box,
      props: previewHeader
    },
    {
      component: Components.box,
      props: intendBox
    },
    {
      component: Components.box,
      props: iframeBox
    }
  ]
}

export const editorBox: IBox = {
  widthProp: "100%",
  heightProp: "94%",
  displayProp: "flex",
  flexDirection: "row",
  children: [
    {
      component: Components.box,
      props: markdownSide,
      contextName: "markdownSide"
    },
    {
      component: Components.box,
      props: intendBox
    },
    {
      component: Components.box,
      props: previewSide,
      contextName: "previewSide"
    }
  ]
}

export const editorBody: IBox = {
  widthProp: window.parent.innerWidth * properties.modal_width + "px",
  heightProp: window.parent.innerHeight * properties.modal_height + "px",
  children: [
    {
      component: Components.box,
      props: editorBox,
      contextName: "editorBox"
    },
    {
      component: Components.box,
      props: intendBox
    },
    {
      component: Components.box,
      props: editorFooter
    }
  ]
}

export const viewerBody: IBox = {
  widthProp: window.parent.innerWidth * properties.modal_width + "px",
  heightProp: window.parent.innerHeight * properties.modal_height + "px",
  children: [
    {
      component: Components.box,
      props: iframeBox
    },
  ],
};

export const markdownitModalDialogProps: IModalDialog = {
  dialogHeader: "",
  dialogBody: marginBox, // TODO: Loader
  displayType: ModalDisplayType.modal,
  fullScreen: false,
  onClose: () => {
    const message: IMessage = {
      actions: [Actions.closeModal],
    };

    return message;
  },
  onLoad: async () => {
    return {
      newDialogHeader: markdownitModalDialogProps.dialogHeader || "",
      newDialogBody: markdownitModalDialogProps.dialogBody,
    };
  },
  autoMaxHeight: true,
  autoMaxWidth: true,
};