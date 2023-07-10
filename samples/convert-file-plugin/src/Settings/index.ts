import { FilesExst, ISettings, SettingsType } from "onlyoffice-docspace-plugin";

import inputGroup, { fileNameProps } from "./InputGroup";
import checkboxGroup, { docxProps, xlsxProps } from "./CheckboxGroup";
import toggleButtonGroup from "./ToggleButtonGroup";
import acceptButton from "./AcceptButton";
import convertFile, { SettingsValue } from "../ConvertFile";
import plugin from "..";

export const settingsElements: ISettings = {
  type: SettingsType.settingsPage,
  groups: [...inputGroup, checkboxGroup, toggleButtonGroup],
  withAcceptButton: true,
  acceptButton: acceptButton,
  isLoading: true,
  onLoad: async () => {
    const value: SettingsValue | null = await convertFile.fetchSettingsValue();

    if (value) {
      fileNameProps.value = value.fileName;
      docxProps.isChecked = value.formats.includes(FilesExst.docx);
      xlsxProps.isChecked = value.formats.includes(FilesExst.xlsx);
      if (Array.isArray(toggleButtonGroup.elementProps)) {
        toggleButtonGroup.elementProps[0].isChecked = value.localStorage;
        toggleButtonGroup.elementProps[1].isChecked = value.mockApi;
      }

      settingsElements.groups = [
        ...inputGroup,
        checkboxGroup,
        toggleButtonGroup,
      ];
    }

    settingsElements.isLoading = false;

    plugin.setPluginSettings(settingsElements);

    return false;
  },
};
