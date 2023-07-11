import { IButton, ButtonSize } from "onlyoffice-docspace-plugin";

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
