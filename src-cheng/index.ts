import { createConfig } from "@vue-start/config";
import { createStore } from "./store";
import { createRequest } from "./request";
import { createRouter } from "./route";
import { App } from "./App";
import { createApp } from "vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "@vue-start/pro/index.css";
import "@vue-start/media/index.css";

import "./style/normalize.css";
import "./style/base.css";

const init = async () => {
  const store$ = await createStore();
  const request = createRequest();
  const router = createRouter();
  const config = createConfig();

  const app = createApp(App).use(config).use(store$).use(request).use(router).use(ElementPlus);

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  app.mount("#app");
};

init();
