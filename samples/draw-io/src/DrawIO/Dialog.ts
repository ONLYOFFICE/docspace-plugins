import {
  Actions,
  Components,
  IBox,
  IFrame,
  IMessage,
  IModalDialog,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";

export const frameProps: IFrame = {
  width: "100%",
  height: "100%",
  name: "test-drawio",
  src: "",
};

const body: IBox = {
  widthProp: "100%",
  heightProp: "100%",

  children: [
    {
      component: Components.iFrame,
      props: frameProps,
    },
  ],
};

export const drawIoModalDialogProps: IModalDialog = {
  dialogHeader: "",
  dialogBody: body,
  displayType: ModalDisplayType.modal,
  fullScreen: true,
  onClose: () => {
    const message: IMessage = {
      actions: [Actions.closeModal],
    };

    return message;
  },
  onLoad: async () => {
    return {
      newDialogHeader: drawIoModalDialogProps.dialogHeader || "",
      newDialogBody: drawIoModalDialogProps.dialogBody,
    };
  },
  autoMaxHeight: true,
  autoMaxWidth: true,
};
