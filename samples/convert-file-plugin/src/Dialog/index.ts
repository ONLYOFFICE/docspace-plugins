import {
  IModalDialog,
  IBox,
  Components,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";

import { nameGroup } from "./Name";
import { buttonGroup, onCancelClick } from "./button";

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [nameGroup, { component: Components.box, props: buttonGroup }],
};

export const convertFileDialog: IModalDialog = {
  dialogHeader: "Convert file to PDF",
  dialogBody: parentBox,
  displayType: ModalDisplayType.modal,
  autoMaxHeight: true,
  onClose: onCancelClick,
  onLoad: async () => {
    return { newDialogHeader: "Convert file to PDF", newDialogBody: parentBox };
  },
};
