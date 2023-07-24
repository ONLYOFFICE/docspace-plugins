import { IEventListenerItem } from "../items";

export interface IEventListenerPlugin {
  eventListenerItems: Map<string, IEventListenerItem>;

  addEventListenerItem(item: IEventListenerItem): void;

  getEventListenerItems(): Map<string, IEventListenerItem>;
}
