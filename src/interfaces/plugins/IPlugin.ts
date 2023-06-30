import { PluginStatus } from "../../enums/PluginStatus";

export interface IPlugin {
  status: PluginStatus;

  updateStatus(status: PluginStatus): void;
}
