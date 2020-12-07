import { Persist } from "@bridge-start/persist";
import { createStore } from "@vue-start/store";

const persist = new Persist({ name: "vue-start" });
const store$ = createStore({});
persist.loadPersistData((values) => {
  store$.next({
    ...values,
    ...store$.value,
  });
  persist.persistRx(store$);
});

export default store$;
