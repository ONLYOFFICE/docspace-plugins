import { PluginStatus } from "../../enums";

export interface IPlugin {
  status: PluginStatus;

  onLoadCallback: () => Promise<void>;

  updateStatus(status: PluginStatus): void;

  getStatus(): PluginStatus;

  setOnLoadCallback(callback: () => Promise<void>): void;
}
