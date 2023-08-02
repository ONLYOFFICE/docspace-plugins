import {
  Components,
  IBox,
  ISettings,
  SettingsType,
} from "@onlyoffice/docspace-plugin-sdk";

import {
  checkboxGroupBox,
  checkboxGroupBoxSkeleton,
  pdfProps,
  txtProps,
} from "./CheckboxGroup";
import { acceptButtonBox, acceptButtonBoxSkeleton } from "./AcceptButton";
import { cancelButtonBox, cancelButtonBoxSkeleton } from "./CancelButton";

import convertFile, { AdminSettingsValue } from "../ConvertFile";

import plugin from "..";

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: checkboxGroupBox },
    {
      component: Components.box,
      props: {
        displayProp: "flex",
        flexDirection: "row",
        children: [
          { component: Components.box, props: acceptButtonBox },
          { component: Components.box, props: cancelButtonBox },
        ],
      },
    },
  ],
};

const loaderBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: checkboxGroupBoxSkeleton },
    {
      component: Components.box,
      props: {
        displayProp: "flex",
        flexDirection: "row",
        children: [
          { component: Components.box, props: acceptButtonBoxSkeleton },
          { component: Components.box, props: cancelButtonBoxSkeleton },
        ],
      },
    },
  ],
};

export const adminSettingsElements: ISettings = {
  type: SettingsType.modal,
  customSettings: loaderBox,
  onLoad: async () => {
    const value: AdminSettingsValue | null =
      await convertFile.fetchAdminSettingsValue();

    if (value) {
      pdfProps.isChecked = value.pdf;
      txtProps.isChecked = value.txt;
    }

    adminSettingsElements.isLoading = false;

    plugin.setAdminPluginSettings(adminSettingsElements);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ customSettings: parentBox });
      }, 500);
    });
  },
};
