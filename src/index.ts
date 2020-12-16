import { createApp } from "vue";
import router from "./router";
import store$ from "./store";
import App from "./App.vue";
import { createRequest } from "@vue-start/request";

const request = createRequest({}, []);

createApp(App).use(store$).use(router).use(request).mount("#root");
