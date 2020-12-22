import { IEpic, Store, TData } from "./core";
import { inject, onBeforeUnmount } from "vue";

export const storeKey = "$store";

export const createStore = (initialState: TData): Store => {
  return Store.create(initialState);
};

export const useStore = <TRoot extends TData = {}>(): Store<TRoot> => inject<Store<TRoot>>(storeKey)!;

export const useEpic = (epic: IEpic) => {
  const store$ = useStore();
  const sub = store$.epicOn(epic);

  onBeforeUnmount(() => {
    sub && sub.unsubscribe();
  });
};
