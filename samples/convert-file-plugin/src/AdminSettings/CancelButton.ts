import {
  IButton,
  ButtonSize,
  ButtonGroup,
  IBox,
  Components,
  IMessage,
  Actions,
  ISkeleton,
  SkeletonGroup,
} from "@onlyoffice/docspace-plugin-sdk";

const onCancelButtonClick = () => {
  const message: IMessage = {
    actions: [Actions.closeSettingsModal],
  };

  return message;
};

const cancelButtonProps: IButton = {
  label: "Cancel",
  primary: false,
  scale: true,
  isDisabled: false,
  onClick: onCancelButtonClick,
  size: ButtonSize.normal,
};

const cancelButtonGroup: ButtonGroup = {
  component: Components.button,
  props: cancelButtonProps,
  contextName: "cancel-button",
};

export const cancelButtonBox: IBox = {
  marginProp: "0",
  widthProp: "50%",
  children: [cancelButtonGroup],
};

const cancelButtonPropsSkeleton: ISkeleton = {
  width: "100%",
  height: "40px",
  borderRadius: "6px",
};

const cancelButtonGroupSkeleton: SkeletonGroup = {
  component: Components.skeleton,
  props: cancelButtonPropsSkeleton,
};

export const cancelButtonBoxSkeleton: IBox = {
  widthProp: "50%",
  children: [cancelButtonGroupSkeleton],
};
