const IMainButtonPlugin = "IMainButtonPlugin";
const IMainButtonItem = "IMainButtonItem";

const mainButtonItems = `
  mainButtonItems: Map<string, IMainButtonItem> = new Map();`;

const addMainButtonItem = `
  addMainButtonItem = (item: IMainButtonItem ): void => {
    this.mainButtonItems.set(item.key, item);
  };`;

const getMainButtonItems = `
  getMainButtonItems = (): Map<string, IMainButtonItem > => {
    return this.mainButtonItems;
  };`;

const updateMainButtonItem = `
  updateMainButtonItem = (item: IMainButtonItem): void => {
    this.mainButtonItems.set(item.key, item);
  };`;

export const getMainButtonTemp = (withMainButton) => {
  if (!withMainButton)
    return {
      IMainButtonPlugin,
      IMainButtonItem,

      mainButtonVars: "",
      mainButtonMeth: "",
    };

  let mainButtonVars = "";
  let mainButtonMeth = "";

  if (withMainButton) {
    mainButtonVars = `
  ${mainButtonItems}`;

    mainButtonMeth = `
        ${addMainButtonItem}
        ${getMainButtonItems}
        ${updateMainButtonItem}`;
  }

  return {
    IMainButtonPlugin,
    IMainButtonItem,

    mainButtonVars,
    mainButtonMeth,
  };
};
