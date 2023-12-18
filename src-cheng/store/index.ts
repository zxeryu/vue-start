import { Persist } from "@vue-start/persist";
import { createStore as createStoreOrigin } from "@vue-start/store";

/**
 * create store
 */
export const createStore = async () => {
  const persist = new Persist({ name: "cheng" });
  const values = await persist.loadPersistData();
  const store$ = createStoreOrigin(values!);
  persist.persistRx(store$);
  return store$;
};
