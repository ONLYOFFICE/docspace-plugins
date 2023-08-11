import { IBox, ISettings, SettingsType } from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";
import plugin from "../..";

import { userAcceptGroup } from "./Button";
import { themeGroup, themeOptions, themeComboBox } from "./Theme";
import { darkGroup, darkOptions, darkComboBox } from "./Dark";

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  marginProp: "16 0 0 0",
  children: [themeGroup, darkGroup, userAcceptGroup],
};

const userSettings: ISettings = {
  type: SettingsType.settingsPage,

  customSettings: parentBox,
  onLoad: async () => {
    const userSettingsVal = drawIo.fetchAdminSettings();

    if (!userSettingsVal) return { customSettings: parentBox };

    themeComboBox.selectedOption = themeOptions.find(
      (o) => o.key === drawIo.userSettings.theme
    ) || { key: "default", label: "Default" };

    darkComboBox.selectedOption = darkOptions.find(
      (o) => o.key === drawIo.userSettings.dark
    ) || {
      key: "auto",
      label: "Auto",
    };

    plugin.setUserPluginSettings(userSettings);

    return { customSettings: parentBox };
  },
};

export { userSettings };
