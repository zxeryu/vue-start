import { Persist } from "@bridge-start/persist";
import { createStore as createStoreOrigin } from "@vue-start/store";

export const createStore = (cb: (store$: any) => void) => {
  const persist = new Persist({ name: "pro" });
  persist.loadPersistData((values) => {
    const store$ = createStoreOrigin(values);
    persist.persistRx(store$);

    cb(store$);
  });
};
