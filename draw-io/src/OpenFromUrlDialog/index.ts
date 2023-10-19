import {
  IModalDialog,
  IBox,
  IText,
  Components,
  ModalDisplayType,
} from "@onlyoffice/docspace-plugin-sdk";
import { urlGroup } from "./Url";
import { nameGroup } from "./Name";
import { buttonGroup, onCancelClick } from "./button";

const descTextProps: IText = {
  text: "Make sure that public link access is open",
};

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    urlGroup,
    nameGroup,
    { component: Components.text, props: descTextProps },
    { component: Components.box, props: buttonGroup },
  ],
};

export const openFromUrlProps: IModalDialog = {
  dialogHeader: "Import diagram",
  dialogBody: parentBox,
  displayType: ModalDisplayType.modal,
  autoMaxHeight: true,
  onClose: onCancelClick,
  onLoad: async () => {
    return { newDialogHeader: "Import diagram", newDialogBody: parentBox };
  },
};
