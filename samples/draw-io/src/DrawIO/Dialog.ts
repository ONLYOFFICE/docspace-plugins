import {
  Actions,
  Components,
  IBox,
  IFrame,
  IMessage,
  IModalDialog,
  ISkeleton,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";

export const frameProps: IFrame = {
  width: "100%",
  height: "100%",
  name: "test-drawio",
  src: "",
};

const skeletonProps: ISkeleton = {
  width: "100%",
  height: "100%",
};

const body: IBox = {
  widthProp: "100vw",
  heightProp: "calc(var(--vh, 1vh) * 100)",

  children: [
    {
      component: Components.iFrame,
      props: frameProps,
    },
  ],
};

const bodySkeleton: IBox = {
  widthProp: "100vw",
  heightProp: "calc(var(--vh, 1vh) * 100)",
  children: [
    {
      component: Components.skeleton,
      props: skeletonProps,
    },
  ],
};

export const drawIoModalDialogProps: IModalDialog = {
  dialogHeader: "",
  dialogBody: body,
  displayType: ModalDisplayType.modal,
  onClose: () => {
    const message: IMessage = {
      actions: [Actions.closeModal],
    };

    return message;
  },
  onLoad: async () => {
    return {
      newDialogHeader: drawIoModalDialogProps.dialogHeader,
      newDialogBody: drawIoModalDialogProps.dialogBody,
    };
  },
  autoMaxHeight: true,
  autoMaxWidth: true,
};
