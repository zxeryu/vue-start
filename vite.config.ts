import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@vue-start/antd-pro": path.resolve(__dirname, "./@vue-start/antd-pro/index"),
      "@vue-start/config": path.resolve(__dirname, "./@vue-start/config/index"),
      "@vue-start/element-pro": path.resolve(__dirname, "./@vue-start/element-pro/index"),
      "@vue-start/hooks": path.resolve(__dirname, "./@vue-start/hooks/index"),
      "@vue-start/pro": path.resolve(__dirname, "./@vue-start/pro/index"),
      "@vue-start/request": path.resolve(__dirname, "./@vue-start/request/index"),
      "@vue-start/store": path.resolve(__dirname, "./@vue-start/store/index"),
    },
  },
  plugins: [vue(), vueJsx()],
});
