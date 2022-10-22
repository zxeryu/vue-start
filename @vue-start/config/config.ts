import { parse } from "./configvalue";
import { App, inject } from "vue";

const getDevKitValue = (key: string) => {
  return globalThis.document?.querySelector(`meta[name="devkit:${key}"]`)?.getAttribute("content") || "";
};

type TConfig = { [key: string]: string };

export const getConfig = (): TConfig => {
  const app = parse(getDevKitValue("app"));

  const config = parse(getDevKitValue("config"));

  return { ...config, ...app } as TConfig;
};

const storeKey = "$config";

export const createConfig = () => (app: App) => {
  const config = getConfig();
  app.provide<TConfig>(storeKey, config);
};

export const useConfig = (): TConfig => inject<TConfig>(storeKey)!;
