import { createApp } from "vue";
import router from "./router";
import store$ from "./store";
import App from "./App.vue";
import { createConfig } from "@vue-start/config";
import { createRequest, ContentTypeInterceptor } from "@vue-start/request";

import "ant-design-vue/dist/antd.css";

const request = createRequest({}, [ContentTypeInterceptor]);
const config = createConfig();

createApp(App).use(store$).use(router).use(config).use(request).mount("#root");
