import { IButton, ButtonSize } from "onlyoffice-docspace-plugin";

import convertFile from "../ConvertFile";

const onCancelButtonClick = () => {
  convertFile.setAcceptFromModalSettings(false);
  convertFile.setCurrentFileId(null);

  return {};
};

const cancelButton: IButton = {
  label: "Cancel",
  primary: false,
  isDisabled: false,
  onClick: onCancelButtonClick,
  size: ButtonSize.small,
};

export default cancelButton;
