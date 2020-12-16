import { parse } from "querystring";
import { App, inject } from "vue";

const getDevKitValue = (key: string) => {
  return globalThis.document?.querySelector(`meta[name="devkit:${key}"]`)?.getAttribute("content") || "";
};

type TConfig = { [key: string]: string };

export const getConfig = (): TConfig => {
  const app = parse(getDevKitValue("app"), ",", "=", {
    decodeURIComponent: (v) => v,
  });

  const config = parse(getDevKitValue("config"), ",", "=", {
    decodeURIComponent: (v) => v,
  });

  return { ...config, ...app } as TConfig;
};

const storeKey = "$config";

export const createConfig = () => (app: App) => {
  const config = getConfig();
  app.provide<TConfig>(storeKey, config);
};

export const useConfig = (): TConfig => inject<TConfig>(storeKey)!;
