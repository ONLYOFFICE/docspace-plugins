const IContextMenuPlugin = "IContextMenuPlugin";
const IContextMenuItem = "IContextMenuItem";

const contextMenuItems = `
  contextMenuItems: Map<string, IContextMenuItem | ISeparatorItem> = new Map();`;

const addContextMenuItem = `
  addContextMenuItem = (item: IContextMenuItem | ISeparatorItem): void => {
    this.contextMenuItems.set(item.key, item);
  };`;

const getContextMenuItems = `
  getContextMenuItems = (): Map<string, IContextMenuItem | ISeparatorItem> => {
    return this.contextMenuItems;
  };`;

const getContextMenuItemsKeys = `
  getContextMenuItemsKeys = (): string[] => {
    const keys = Array.from(this.contextMenuItems).map(([key, item]) => key);

    return keys;
  };`;

const updateContextMenuItem = `
  updateContextMenuItem = (item: IContextMenuItem | ISeparatorItem): void => {
    this.contextMenuItems.set(item.key, item);
  };`;

export const getContextMenuTemp = (withContextMenu) => {
  if (!withContextMenu)
    return {
      IContextMenuPlugin,
      IContextMenuItem,

      contextMenuVars: "",
      contextMenuMeth: "",
    };

  let contextMenuVars = "";
  let contextMenuMeth = "";

  contextMenuVars = `
  ${contextMenuItems}`;

  contextMenuMeth = `
        ${addContextMenuItem}
        ${getContextMenuItems}
        ${getContextMenuItemsKeys}
        ${updateContextMenuItem}`;

  return {
    IContextMenuPlugin,
    IContextMenuItem,

    contextMenuVars,
    contextMenuMeth,
  };
};
