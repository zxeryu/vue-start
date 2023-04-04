import { createApp } from "vue";
import { App } from "./App";

import { AxiosInterceptorManager, AxiosRequestConfig } from "axios";
import { createRouter } from "./router";
import { createStore } from "./store";
import { createConfig } from "@vue-start/config";
import { createRequest, ContentTypeInterceptor } from "@vue-start/request";

import "tailwindcss/tailwind.css";
import "./style/index.css";
import "./style/pro.css";
//
import "highlight.js/styles/github.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/lib/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import { DemoBox } from "@/layout/DemoBox";
import { initComp } from "@/component";

//request
const urlInterceptor = (request: AxiosInterceptorManager<AxiosRequestConfig>) => {
  request.use((requestConfig) => {
    requestConfig.url = `http://localhost:7070${requestConfig.url}`;
    return requestConfig;
  });
};

const router = createRouter();
const config = createConfig();
const request = createRequest({}, [ContentTypeInterceptor, urlInterceptor]);
const store$ = await createStore();

const app = createApp(App).use(store$).use(router).use(config).use(request).use(ElementPlus, { locale });

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

//注册组件
app.component("demo-box", DemoBox);

initComp(app);

app.mount("#app");
