import { Store, TData } from "./core";
import { inject } from "vue";

export const storeKey = "$store";

export const createStore = (initialState: TData): Store => {
  return Store.create(initialState);
};

export const useStore = <TRoot extends TData = {}>(): Store<TRoot> => inject<Store<TRoot>>(storeKey)!;
