import {
  Components,
  FilesExst,
  IBox,
  ISettings,
  SettingsType,
} from "@onlyoffice/docspace-plugin-sdk";

import { inputGroup, inputGroupSkeleton, fileNameProps } from "./InputGroup";
import {
  checkboxGroupBox,
  checkboxGroupBoxSkeleton,
  docxProps,
  xlsxProps,
} from "./CheckboxGroup";
import { acceptButtonBox, acceptButtonBoxSkeleton } from "./AcceptButton";

import convertFile, { UserSettingsValue } from "../ConvertFile";

import plugin from "..";

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: inputGroup },
    { component: Components.box, props: checkboxGroupBox },
    { component: Components.box, props: acceptButtonBox },
  ],
};

const loaderBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: inputGroupSkeleton },
    { component: Components.box, props: checkboxGroupBoxSkeleton },
    { component: Components.box, props: acceptButtonBoxSkeleton },
  ],
};

export const settingsElements: ISettings = {
  type: SettingsType.both,
  customSettings: loaderBox,
  onLoad: async () => {
    const value: UserSettingsValue | null =
      await convertFile.fetchUserSettingsValue();

    if (value) {
      fileNameProps.value = value.fileName;

      docxProps.isChecked = value.formats.includes(FilesExst.docx);
      xlsxProps.isChecked = value.formats.includes(FilesExst.xlsx);
    }

    settingsElements.isLoading = false;

    plugin.setUserPluginSettings(settingsElements);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ customSettings: parentBox });
      }, 500);
    });
  },
};
