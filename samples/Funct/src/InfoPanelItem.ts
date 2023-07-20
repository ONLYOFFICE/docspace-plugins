import {
  Components,
  IInfoPanelItem,
  IInput,
  IBox,
  IComponent,
  IText,
  InfoPanelSubMenu,
} from "@onlyoffice/docspace-plugin-sdk";

const parentBox: IBox = {};

const parentBoxChildren: IComponent[] = [];

const textProps: IText = { text: "Test, its work" };

const textComponent: IComponent = {
  component: Components.text,
  props: textProps,
};

const infoPanelSubMenu: InfoPanelSubMenu = {
  name: "Test",
  onClick: () => console.log("work"),
};

export const InfoPanelItem: IInfoPanelItem = {
  key: "test-info-panel",
  subMenu: infoPanelSubMenu,
  body: parentBox,
};
