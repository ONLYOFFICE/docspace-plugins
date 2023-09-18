import { Components, IBox, ISettings } from "@onlyoffice/docspace-plugin-sdk";

import drawIo from "../../Drawio";
import plugin from "../..";

import { urlGroup, urlInput } from "./Url";
import { langComboBox, langGroup, options } from "./Lang";
import { offGroup, offToggleButtonProps, offDescriptionBox } from "./Off";
import { libGroup, libToggleButtonProps } from "./Lib";
import { adminButtonComponent } from "./Button";

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  marginProp: "16 0 0 0",
  children: [
    urlGroup,
    langGroup,
    offGroup,
    { component: Components.box, props: { ...offDescriptionBox } },
    libGroup,
  ],
};

const adminSettings: ISettings = {
  settings: parentBox,
  saveButton: adminButtonComponent,
  onLoad: async () => {
    const adminSettingsVal = drawIo.fetchAdminSettings();

    urlInput.value = drawIo.adminSettings.url;
    langComboBox.selectedOption = options.find(
      (o) => o.key === drawIo.adminSettings.lang
    ) || {
      key: "auto",
      label: "Auto",
    };
    offToggleButtonProps.isChecked = drawIo.adminSettings.off;
    libToggleButtonProps.isChecked = drawIo.adminSettings.lib;

    if (!adminSettingsVal) return { settings: parentBox };

    urlInput.value = adminSettingsVal.url;
    langComboBox.selectedOption = options.find(
      (o) => o.key === adminSettingsVal.lang
    ) || {
      key: "auto",
      label: "Auto",
    };
    offToggleButtonProps.isChecked = adminSettingsVal.off;
    libToggleButtonProps.isChecked = adminSettingsVal.lib;

    plugin.setAdminPluginSettings(adminSettings);

    return { settings: parentBox };
  },
};

export { adminSettings };
