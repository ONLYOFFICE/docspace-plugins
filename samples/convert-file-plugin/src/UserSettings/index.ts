import { FilesExst, ISettings, SettingsType } from "onlyoffice-docspace-plugin";

import inputGroup, { fileNameProps } from "./InputGroup";
import checkboxGroup, { docxProps, xlsxProps } from "./CheckboxGroup";
import toggleButtonGroup, {
  localStorageProps,
  mockApiStorageProps,
} from "./ToggleButtonGroup";
import acceptButton from "./AcceptButton";
import cancelButton from "./CancelButton";

import convertFile, { UserSettingsValue } from "../ConvertFile";

import plugin from "..";

export const settingsElements: ISettings = {
  type: SettingsType.both,
  groups: [...inputGroup, checkboxGroup, toggleButtonGroup],
  withAcceptButton: true,
  acceptButtonProps: acceptButton,
  cancelButtonProps: cancelButton,
  isLoading: true,
  onLoad: async () => {
    const value: UserSettingsValue | null =
      await convertFile.fetchUserSettingsValue();

    if (value) {
      fileNameProps.value = value.fileName;

      docxProps.isChecked = value.formats.includes(FilesExst.docx);
      xlsxProps.isChecked = value.formats.includes(FilesExst.xlsx);

      localStorageProps.isChecked = value.localStorage;
      mockApiStorageProps.isChecked = value.mockApi;

      settingsElements.groups = [
        ...inputGroup,
        checkboxGroup,
        toggleButtonGroup,
      ];
    }

    settingsElements.isLoading = false;

    plugin.setUserPluginSettings(settingsElements);

    return false;
  },
};
