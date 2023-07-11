import {
  Actions,
  ToastType,
  IToggleButton,
  IControlGroup,
  ControlGroupElement,
} from "onlyoffice-docspace-plugin";

const onLocalStorageChange = () => {
  localStorageProps.isChecked = !localStorageProps.isChecked;

  const localStorageToastTitle = localStorageProps.isChecked
    ? "Plugin will save info at local storage"
    : "Plugin will not save info at local storage";

  return {
    newProps: toggleButtonProps,
    actions: [Actions.updateProps, Actions.showToast],
    toastProps: [
      {
        type: localStorageProps.isChecked ? ToastType.success : ToastType.info,
        title: localStorageToastTitle,
      },
    ],
  };
};

export const localStorageProps: IToggleButton = {
  isChecked: false,
  label: "Local storage",
  onChange: onLocalStorageChange,
};

const onMockApiStorageChange = () => {
  mockApiStorageProps.isChecked = !mockApiStorageProps.isChecked;

  const mockApiStorageToastTitle = mockApiStorageProps.isChecked
    ? "Plugin will save info at mock api"
    : "Plugin will not save info at mock api";

  return {
    newProps: toggleButtonProps,
    actions: [Actions.updateProps, Actions.showToast],
    toastProps: [
      {
        type: mockApiStorageProps.isChecked
          ? ToastType.success
          : ToastType.info,
        title: mockApiStorageToastTitle,
      },
    ],
  };
};

export const mockApiStorageProps: IToggleButton = {
  isChecked: false,
  label: "Mock api storage",
  onChange: onMockApiStorageChange,
};

const toggleButtonProps: IToggleButton[] = [
  localStorageProps,
  mockApiStorageProps,
];

const toggleButtonGroup: IControlGroup = {
  header: "Save info",
  element: ControlGroupElement.toggleButton,
  elementProps: toggleButtonProps,
};

export default toggleButtonGroup;
