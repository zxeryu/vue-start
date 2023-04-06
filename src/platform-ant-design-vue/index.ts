import { createApp } from "vue";

import { AxiosInterceptorManager, AxiosRequestConfig } from "axios";
import { createRouter } from "@/router";
import { createStore } from "@/store";
import { createConfig } from "@vue-start/config";
import { createRequest, ContentTypeInterceptor } from "@vue-start/request";

import "@/style/normalize.css";
import "@/style/index.css";
//
import "highlight.js/styles/github.css";

import { DemoBox } from "@/layout/DemoBox";

import "./pro.css";

import { App } from "./App";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.variable.css";
import "dayjs/locale/zh-cn";

import { initComp } from "./component";

//request
const urlInterceptor = (request: AxiosInterceptorManager<AxiosRequestConfig>) => {
  request.use((requestConfig) => {
    requestConfig.url = `http://localhost:7070${requestConfig.url}`;
    return requestConfig;
  });
};

const init = async () => {
  const router = createRouter();
  const config = createConfig();
  const request = createRequest({}, [ContentTypeInterceptor, urlInterceptor]);
  const store$ = await createStore();

  const app = createApp(App).use(store$).use(router).use(config).use(request).use(Antd);

  //注册组件
  app.component("demo-box", DemoBox);

  initComp(app);

  app.mount("#app");
};

init();
