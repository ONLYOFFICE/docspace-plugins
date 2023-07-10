export interface IApiPlugin {
  origin: string;
  proxy: string;
  prefix: string;

  setOrigin(origin: string): void;
  setProxy(proxy: string): void;
  setPrefix(prefix: string): void;

  getOrigin(): string;
  getProxy(): string;
  getPrefix(): string;

  setAPI(origin: string, proxy: string, prefix: string): void;

  getAPI(): { origin: string; proxy: string; prefix: string };
}
