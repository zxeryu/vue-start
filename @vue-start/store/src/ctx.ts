import { Store } from "./core";
import { inject } from "vue";

export const storeKey = "$store";

export const createStore = (initialState: { [key: string]: any }): Store => {
  return Store.create(initialState);
};

export const useStore = () => inject<Store>(storeKey);
