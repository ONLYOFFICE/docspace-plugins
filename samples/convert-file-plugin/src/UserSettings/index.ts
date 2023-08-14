import {
  Components,
  IBox,
  ISettings,
  SettingsType,
} from "@onlyoffice/docspace-plugin-sdk";

import { inputGroup, inputGroupSkeleton, fileNameProps } from "./InputGroup";

import { acceptButtonBox, acceptButtonBoxSkeleton } from "./AcceptButton";

import convertFile, { UserSettingsValue } from "../ConvertFile";

import plugin from "..";

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: inputGroup },
    { component: Components.box, props: acceptButtonBox },
  ],
};

const loaderBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  children: [
    { component: Components.box, props: inputGroupSkeleton },
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
    }

    settingsElements.isLoading = false;

    plugin.setUserPluginSettings(settingsElements);

    return { customSettings: parentBox };
  },
};
