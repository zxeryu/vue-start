import { createApp } from "vue";
import App from "./App.vue";

import { AxiosInterceptorManager, AxiosRequestConfig } from "axios";
import { createRouter } from "./router";
import { createStore } from "./store";
import { createConfig } from "@vue-start/config";
import { createRequest, ContentTypeInterceptor } from "@vue-start/request";

import { ProCurd, ProSearchForm, ProForm, ProCurdList, ProModalCurd } from "@vue-start/pro";
import { Page } from "@/component/Page";
import { Table } from "@/component/Table";
import { DemoBox } from "@/layout/DemoBox";

import "tailwindcss/tailwind.css";
import "./style/index.css";
import "./style/pro.css";
//
import "highlight.js/styles/github.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/lib/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

//request
const urlInterceptor = (request: AxiosInterceptorManager<AxiosRequestConfig>) => {
  request.use((requestConfig) => {
    requestConfig.url = `http://localhost:7070${requestConfig.url}`;
    return requestConfig;
  });
};

const init = (store$: any) => {
  const router = createRouter();
  const config = createConfig();
  const request = createRequest({}, [ContentTypeInterceptor, urlInterceptor]);

  const app = createApp(App).use(store$).use(router).use(config).use(request).use(ElementPlus, { locale });

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  //注册组件
  app.component("pro-page", Page);
  app.component("pro-form", ProForm);
  app.component("pro-search-form", ProSearchForm);
  app.component("pro-table", Table);
  app.component("pro-curd", ProCurd);
  app.component("pro-modal-curd", ProModalCurd);
  app.component("pro-curd-list", ProCurdList);
  //
  app.component("demo-box", DemoBox);

  app.mount("#root");
};

createStore(init);
