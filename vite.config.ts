import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import htmlPlugin from "vite-plugin-html-config";
import path from "path";

const devData = process.env.VITE_DEV ? JSON.parse(process.env.VITE_DEV) : undefined;
const buildData = process.env.VITE_BUILD ? JSON.parse(process.env.VITE_BUILD) : undefined;

console.log(buildData);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@vue-start/antd-pro": path.resolve(__dirname, "@vue-start/antd-pro/index"),
      "@vue-start/config": path.resolve(__dirname, "@vue-start/config/index"),
      "@vue-start/element-pro": path.resolve(__dirname, "@vue-start/element-pro/index"),
      "@vue-start/hooks": path.resolve(__dirname, "@vue-start/hooks/index"),
      "@vue-start/pro": path.resolve(__dirname, "@vue-start/pro/index"),
      "@vue-start/request": path.resolve(__dirname, "@vue-start/request/index"),
      "@vue-start/store": path.resolve(__dirname, "@vue-start/store/index"),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    devData
      ? htmlPlugin({
          scripts: [
            "",
            {
              src: `/${devData.entry}/index.ts`,
              type: "module",
            },
          ],
        })
      : undefined,
  ],
  build: buildData
    ? {
        outDir: buildData.outDir,
        lib: {
          entry: buildData.entry,
          formats: ["cjs", "es"],
          name: "index",
          fileName: (format) => {
            if (format === "cjs") {
              return "index.js";
            }
            return `index.${format}.js`;
          },
        },
        rollupOptions: {
          external: [
            "vue",
            "vue-router",
            //
            "ant-design-vue",
            "element-plus",
            //
            "axios",
            "rxjs",
            "rxjs/operators",
            "lodash",
            "cross-spawn",
            "js-yaml",
            "fs",
            "path",
            "querystring",
            //
            "@vue-start/hooks",
            "@vue-start/request",
            "@vue-start/pro",
          ],
        },
      }
    : undefined,
});
