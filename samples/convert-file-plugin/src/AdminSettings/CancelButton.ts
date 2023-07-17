import { IButton, ButtonSize } from "@onlyoffice/docspace-plugin-sdk";

const onCancelButtonClick = () => {
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
