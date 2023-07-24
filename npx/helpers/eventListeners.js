const IEventListenerPlugin = "IEventListenerPlugin";
const IEventListenerItem = "IEventListenerItem";

const EventListenerItems = `
  eventListenerItems: Map<string, IEventListenerItem > = new Map();`;

const addEventListenerItem = `
  addEventListenerItem = (item: IEventListenerItem ): void => {
    this.eventListenerItems.set(item.key, item);
  };`;

const getEventListenerItems = `
  getEventListenerItems = (): Map<string, IEventListenerItem > => {
    return this.eventListenerItems;
  };`;

export const getEventListenerTemp = (withEventListener) => {
  if (!withEventListener)
    return {
      IEventListenerPlugin,
      IEventListenerItem,

      eventListenerVars: "",
      eventListenerMeth: "",
    };

  let eventListenerVars = "";
  let eventListenerMeth = "";

  eventListenerVars = `
  ${EventListenerItems}`;

  eventListenerMeth = `
        ${addEventListenerItem}
        ${getEventListenerItems}`;

  return {
    IEventListenerPlugin,
    IEventListenerItem,
    eventListenerVars,
    eventListenerMeth,
  };
};
