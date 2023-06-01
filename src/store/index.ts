import { Persist } from "@vue-start/persist";
import { createStore as createStoreOrigin } from "@vue-start/store";

export const createStore = async () => {
  const persist = new Persist({ name: "pro" });
  const values = await persist.loadPersistData();
  const store$ = createStoreOrigin(values!);
  persist.persistRx(store$);
  return store$;
};
