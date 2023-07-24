const IInfoPanelPlugin = "IInfoPanelPlugin";
const IInfoPanelItem = "IInfoPanelItem";

const infoPanelItems = `
  infoPanelItems: Map<string, IInfoPanelItem> = new Map();`;

const addInfoPanelItem = `
  addInfoPanelItem = (item: IInfoPanelItem ): void => {
    this.infoPanelItems.set(item.key, item);
  };`;

const getInfoPanelItems = `
  getInfoPanelItems = (): Map<string, IInfoPanelItem > => {
    return this.infoPanelItems;
  };`;

const updateInfoPanelItem = `
  updateInfoPanelItem = (item: IInfoPanelItem): void => {
    this.infoPanelItems.set(item.key, item);
  };`;

export const getInfoPanelTemp = (withInfoPanel) => {
  if (!withInfoPanel)
    return {
      IInfoPanelPlugin,
      IInfoPanelItem,

      infoPanelVars: "",
      infoPanelMeth: "",
    };

  let infoPanelVars = "";
  let infoPanelMeth = "";

  infoPanelVars = `
  ${infoPanelItems}`;

  infoPanelMeth = `
        ${addInfoPanelItem}
        ${getInfoPanelItems}
        ${updateInfoPanelItem}`;

  return {
    IInfoPanelPlugin,
    IInfoPanelItem,

    infoPanelVars,
    infoPanelMeth,
  };
};
