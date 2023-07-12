import {
  FilesExst,
  ISettings,
  SettingsType,
} from "@onlyoffice/docspace-plugin";

import checkboxGroup, { pdfProps, txtProps } from "./CheckboxGroup";

import acceptButton from "./AcceptButton";
import cancelButton from "./CancelButton";

import convertFile, { AdminSettingsValue } from "../ConvertFile";

import plugin from "..";

export const adminSettingsElements: ISettings = {
  type: SettingsType.modal,
  groups: [checkboxGroup],
  withAcceptButton: true,
  acceptButtonProps: acceptButton,
  cancelButtonProps: cancelButton,
  isLoading: true,
  onLoad: async () => {
    const value: AdminSettingsValue | null =
      await convertFile.fetchAdminSettingsValue();

    if (value) {
      pdfProps.isChecked = value.pdf;
      txtProps.isChecked = value.txt;

      adminSettingsElements.groups = [checkboxGroup];
    }

    adminSettingsElements.isLoading = false;

    plugin.setAdminPluginSettings(adminSettingsElements);

    return false;
  },
};
