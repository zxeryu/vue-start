import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { createStore } from "@vue-start/store";
import { Persist } from "@bridge-start/persist";

const persist = new Persist({ name: "vue-start" });
persist.loadPersistData((values) => {
  const store$ = createStore(values);
  persist.persistRx(store$);

  createApp(App).use(store$).use(router).mount("#root");
});
