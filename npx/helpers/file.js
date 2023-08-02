const IFilePlugin = "IFilePlugin";
const IFileItem = "IFileItem";

const fileItems = `
  fileItems: Map<string, IFileItem> = new Map();`;

const addFileItem = `
  addFileItem = (item: IFileItem ): void => {
    this.fileItems.set(item.extension, item);
  };`;

const getFileItems = `
  getFileItems = (): Map<string, IFileItem > => {
    return this.fileItems;
  };`;

const updateFileItem = `
  updateFileItem = (item: IFileItem): void => {
    this.fileItems.set(item.extension, item);
  };`;

export const getFileTemp = (withFile) => {
  if (!withFile)
    return {
      IFilePlugin,
      IFileItem,

      fileVars: "",
      fileMeth: "",
    };

  let fileVars = "";
  let fileMeth = "";

  fileVars = `
  ${fileItems}`;

  fileMeth = `
        ${addFileItem}
        ${getFileItems}
        ${updateFileItem}`;

  return {
    IFilePlugin,
    IFileItem,
    fileVars,
    fileMeth,
  };
};
