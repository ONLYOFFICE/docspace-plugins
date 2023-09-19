import {
  BoxGroup,
  Components,
  IBox,
  ISettings,
  TextGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import plugin from "..";
import convertFile from "../ConvertFile";

import { tokenGroup, tokenInput } from "./Token";
import { userButtonComponent } from "./Button";

const descriptionText: TextGroup = {
  component: Components.text,
  props: {
    text: "To generate API secret visit https://www.convertapi.com/",
    color: "#A3A9AE",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
  },
};

const descGroup: BoxGroup = {
  component: Components.box,
  props: { children: [descriptionText] },
};

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  // marginProp: "16px 0 0 0",
  children: [tokenGroup, descGroup],
};

const adminSettings: ISettings = {
  settings: parentBox,
  saveButton: userButtonComponent,
  onLoad: async () => {
    convertFile.fetchAPIToken();

    tokenInput.value = convertFile.apiToken || "";

    if (!convertFile.apiToken) return { settings: parentBox };

    plugin.setAdminPluginSettings(adminSettings);

    return { settings: parentBox };
  },
};

export { adminSettings };
