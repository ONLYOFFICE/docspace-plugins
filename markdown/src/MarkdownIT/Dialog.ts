import {
    Actions,
    ButtonSize,
    Components,
    IBox,
    IButton,
    IFrame,
    IMessage,
    IModalDialog,
    ITextArea,
    IToast,
    IToggleButton,
    ModalDisplayType,
    ToastType,
  } from "@onlyoffice/docspace-plugin-sdk";

  const frameProps: IFrame = {
    width: "100%",
    height: "100%",
    name: "md-viewer",
    id: "md-iframe",
    src: "",
    style: {
      borderRadius: "3px",
      boxShadow: "none",
      boxSizing: "border-box",
      border: "1px solid rgb(208, 213, 218)"
    }
  };

  export const toastProps: IToast = {
    type: ToastType.success,
    title: "File saved"
  }

  export const errorToast: IToast = {
    type: ToastType.error,
    title: "File not saved"
  }

  const intendBox: IBox = {
    widthProp: "10px",
    heightProp: "10px"
  }

  export const saveExitButton: IButton = {
    label: "Save&Exit",
    size: ButtonSize.normal,
    isDisabled:  true,
    primary: true,
    withLoadingAfterClick: true,
    disableWhileRequestRunning: true,
    onClick: () => {}
  }

  export const saveButton: IButton = {
    label: "Save",
    size: ButtonSize.normal,
    isDisabled: true,
    primary: true,
    withLoadingAfterClick: true,
    disableWhileRequestRunning: true,
    onClick: () => {}
  }

  export const syncScroll: IToggleButton = {
    label: "ScrollSync",
    isChecked: false,
    onChange: () => {}
  }

  const editorHeader: IBox = {
    widthProp: "100%",
    marginProp: "-5px 0 0 0",
    displayProp: "flex",
    flexDirection: "row",
    children: [
      {
        component: Components.button,
        props: saveExitButton,
        contextName: "saveExitButton"
      },
      {
        component: Components.box,
        props: intendBox
      },
      {
        component: Components.button,
        props: saveButton,
        contextName: "saveButton"
      },
      {
        component: Components.box,
        props: intendBox
      },
      {
        component: Components.toggleButton,
        props: syncScroll
      }
    ]
  }

  export const mdArea: ITextArea = {
    name: "md-plugin-textarea",
    heightTextArea: window.parent.innerHeight*0.72,
    value: "",
    onChange: ()=>{}
  }

  const areaBox: IBox = {
    widthProp: "50%",
    heightProp: "100%",
    children:[
      {
        component: Components.textArea,
        props: mdArea
      }
    ]
  }

  const iframeBox: IBox = {
    widthProp: "50%",
    heightProp: "100%",
    children: [
      {
        component: Components.iFrame,
        props: frameProps
      }
    ]
  }

  const editorBox: IBox = {
    widthProp: "100%",
    heightProp: "90%",
    displayProp: "flex",
    flexDirection: "row",
    children: [
      {
        component: Components.box,
        props: areaBox
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

  export const editorBody: IBox = {
    widthProp: window.parent.innerWidth*0.9 + "px",
    heightProp: window.parent.innerHeight*0.8 + "px",
    children: [
      {
        component: Components.box,
        props: editorHeader
      },
      {
        component: Components.box,
        props: intendBox
      },
      {
        component: Components.box,
        props: editorBox
      }
    ]
  }
  
  export const body: IBox = {
    widthProp: window.parent.innerWidth*0.9 + "px",
    heightProp: window.parent.innerHeight*0.8 + "px",
    children: [
      {
        component: Components.iFrame,
        props: frameProps,
      },
    ],
  };
  
  export const markdownitModalDialogProps: IModalDialog = {
    dialogHeader: "",
    dialogBody: body,
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