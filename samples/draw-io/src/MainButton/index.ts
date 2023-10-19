import {
  Actions,
  IMainButtonItem,
  IMessage,
} from "@onlyoffice/docspace-plugin-sdk";
import drawIo from "../Drawio";
// import { openFromUrlProps } from "../OpenFromUrlDialog";

// const createItem: IMainButtonItem = {
//   key: "draw-io-main-button-item_create",
//   label: "Create new",
//   icon: "create-new.svg",
//   onClick: (id: number) => {
//     drawIo.setCurrentFolderId(id);

//     const message: IMessage = {
//       actions: [Actions.showCreateDialogModal],
//       createDialogProps: {
//         title: "Create diagram",
//         startValue: "New diagram",
//         visible: true,
//         isCreateDialog: true,
//         extension: ".drawio",
//         onSave: async (e: any, value: string) => {
//           await drawIo.createNewFile(value);
//         },
//         onCancel: (e: any) => {
//           drawIo.setCurrentFolderId(null);
//         },
//         onClose: (e: any) => {
//           drawIo.setCurrentFolderId(null);
//         },
//       },
//     };

//     return message;
//   },
// };

// const openItem: IMainButtonItem = {
//   key: "draw-io-main-button-item_open",
//   label: "Open from URL",
//   icon: "open-drawio.svg",
//   onClick: (id) => {
//     drawIo.setCurrentFolderId(id);

//     const message: IMessage = {
//       actions: [Actions.showModal],
//       modalDialogProps: openFromUrlProps,
//     };

//     return message;
//   },
// };

const mainButtonItem: IMainButtonItem = {
  key: "draw-io-main-button-item",
  label: "Draw.io",
  icon: "drawio.png",
  onClick: (id: number) => {
    drawIo.setCurrentFolderId(id);

    const message: IMessage = {
      actions: [Actions.showCreateDialogModal],
      createDialogProps: {
        title: "Create diagram",
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
  // items: [createItem],
};

export { mainButtonItem };
