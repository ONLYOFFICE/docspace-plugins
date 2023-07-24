const IApiPlugin = "IApiPlugin";
const origin = `origin = "";`;
const proxy = `proxy = "";`;
const prefix = `prefix = "";`;
const setOrigin = `
  setOrigin = (origin: string): void => {
    this.origin = origin;
  };`;

const getOrigin = `
  getOrigin = (): string => {
    return this.origin;
  };`;

const setProxy = `
  setProxy = (proxy: string): void => {
    this.proxy = proxy;
  };`;

const getProxy = `
  getProxy = (): string => {
    return this.proxy;
  };`;

const setPrefix = `
  setPrefix = (prefix: string): void => {
    this.prefix = prefix;
  };`;

const getPrefix = `
  getPrefix = (): string => {
    return this.prefix;
  };`;

const setAPI = `
  setAPI = (origin: string, proxy: string, prefix: string): void => {
    this.origin = origin;
    this.proxy = proxy;
    this.prefix = prefix;
  };`;

const getAPI = `
  getAPI = (): { origin: string; proxy: string; prefix: string } => {
    return { origin: this.origin, proxy: this.proxy, prefix: this.prefix };
  };`;

export const getApiTemp = (withApi) => {
  if (!withApi) return { apiVars: "", apiMeth: "", IApiPlugin };
  let apiVars = "";
  let apiMeth = "";

  if (withApi) {
    apiVars = `
  ${origin}
  ${proxy}
  ${prefix}`;

    apiMeth = `
            ${setOrigin}
            ${getOrigin}
            ${setProxy}
            ${getProxy}
            ${setPrefix}
            ${getPrefix}
            ${setAPI}
            ${getAPI}`;
  }

  return { apiVars, apiMeth, IApiPlugin };
};
