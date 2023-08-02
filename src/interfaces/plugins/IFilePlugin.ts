import { IFileItem } from "../items";

export interface IFilePlugin {
  fileItems: Map<string, IFileItem>;

  addFileItem(item: IFileItem): void;

  getFileItems(): Map<string, IFileItem>;

  updateFileItem(item: IFileItem): void;
}
