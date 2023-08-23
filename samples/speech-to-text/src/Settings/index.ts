import {
  BoxGroup,
  Components,
  IBox,
  ISettings,
  SettingsType,
  TextGroup,
} from "@onlyoffice/docspace-plugin-sdk";

import plugin from "..";
import assemblyAI from "../AssemblyAI";

import { tokenGroup, tokenInput } from "./Token";
import { userAcceptGroup } from "./Button";

const descriptionText: TextGroup = {
  component: Components.text,
  props: { text: "To generate API token visit https://www.assemblyai.com/" },
};

const descGroup: BoxGroup = {
  component: Components.box,
  props: { marginProp: "0 0 16px", children: [descriptionText] },
};

const parentBox: IBox = {
  displayProp: "flex",
  flexDirection: "column",
  marginProp: "16 0 0 0",
  children: [tokenGroup, descGroup, userAcceptGroup],
};

const userSettings: ISettings = {
  type: SettingsType.modal,
  customSettings: parentBox,
  onLoad: async () => {
    assemblyAI.fetchAPIToken();

    tokenInput.value = assemblyAI.apiToken;

    if (!assemblyAI.apiToken) return { customSettings: parentBox };

    plugin.setUserPluginSettings(userSettings);

    return { customSettings: parentBox };
  },
};

export { userSettings };
