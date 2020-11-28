import { Store } from "./core";
import { App, inject } from "vue";

const storeKey = "$store";

type PluginInstallFunction = (app: App, ...options: any[]) => any;

export const createStore = (initialState: { [key: string]: any }): PluginInstallFunction => {
  const store = Store.create(initialState);
  return (app: App) => {
    app.provide<Store>(storeKey, store);
  };
};

export const useStore = () => inject<Store>(storeKey);
