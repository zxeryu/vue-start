import { createApp } from "vue";
import { createStore } from "@vue-start/store";
import { Persist } from "@bridge-start/persist";
import { App } from "./App";
import "./index.css";
import { createRouter } from "@el/router";

import { ProForm, ProPage, ProSearchForm, ProTable } from "@vue-start/element-pro";
import { ProCurd, ProModalCurd } from "@vue-start/pro";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/lib/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createRequest } from "@vue-start/request";
import { DemoBox } from "@el/layout/DemoBox";

const init = (store$: any) => {
  const router = createRouter();

  const request = createRequest({}, []);

  const app = createApp(App).use(store$).use(router).use(request).use(ElementPlus, { locale });

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  //注册组件
  app.component("pro-page", ProPage);
  app.component("pro-form", ProForm);
  app.component("pro-search-form", ProSearchForm);
  app.component("pro-table", ProTable);
  app.component("pro-curd", ProCurd);
  app.component("pro-modal-curd", ProModalCurd);
  //
  app.component("demo-box", DemoBox);

  app.mount("#root");
};

const persist = new Persist({ name: "element-plus" });
persist.loadPersistData((values) => {
  const store$ = createStore(values);
  persist.persistRx(store$);

  init(store$);
});
