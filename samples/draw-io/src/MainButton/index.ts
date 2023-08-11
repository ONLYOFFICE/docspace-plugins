import {
  Actions,
  IMainButtonItem,
  IMessage,
} from "@onlyoffice/docspace-plugin-sdk";
import drawIo from "../Drawio";
import { openFromUrlProps } from "../OpenFromUrlDialog";

const createItem: IMainButtonItem = {
  key: "draw-io-main-button-item_create",
  position: 0,
  label: "Create",
  icon: "create-drawio.svg",
  onClick: (id: number) => {
    drawIo.setCurrentFolderId(id);

    const message: IMessage = {
      actions: [Actions.showCreateDialogModal],
      createDialogProps: {
        title: "New diagram",
        startValue: "New diagram",
        visible: true,
        isCreateDialog: true,
        extension: ".drawio",
        onSave: async (e: any, value: string) => {
          await drawIo.createNewFile(value);
        },
        onCancel: (e: any) => {
          drawIo.setCurrentFolderId(null);
        },
        onClose: (e: any) => {
          drawIo.setCurrentFolderId(null);
        },
      },
    };

    return message;
  },
};

const openItem: IMainButtonItem = {
  key: "draw-io-main-button-item_open",
  position: 1,
  label: "Open from URL",
  icon: "open-drawio.svg",
  onClick: (id) => {
    drawIo.setCurrentFolderId(id);

    const message: IMessage = {
      actions: [Actions.showModal],
      modalDialogProps: openFromUrlProps,
    };

    return message;
  },
};

const mainButtonItem: IMainButtonItem = {
  key: "draw-io-main-button-item",
  position: 5,
  label: "Create diagram",
  icon: "drawio.png",
  // items: [createItem, openItem],
  onClick: (id: number) => {
    drawIo.setCurrentFolderId(id);

    const message: IMessage = {
      actions: [Actions.showCreateDialogModal],
      createDialogProps: {
        title: "New diagram",
        startValue: "New diagram",
        visible: true,
        isCreateDialog: true,
        extension: ".drawio",
        onSave: async (e: any, value: string) => {
          await drawIo.createNewFile(value);
        },
        onCancel: (e: any) => {
          drawIo.setCurrentFolderId(null);
        },
        onClose: (e: any) => {
          drawIo.setCurrentFolderId(null);
        },
      },
    };

    return message;
  },
};

export { mainButtonItem };
