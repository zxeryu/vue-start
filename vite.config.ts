import { defineConfig, loadEnv } from "vite";
import { omit } from "lodash";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import htmlPlugin from "vite-plugin-html-config";
import path from "path";
import { tsxWithCode } from "./plugin/tsxWithCode";
import { createHtml } from "./plugin/html";

const devData = process.env.VITE_DEV ? JSON.parse(process.env.VITE_DEV) : undefined;
const buildData = process.env.VITE_BUILD ? JSON.parse(process.env.VITE_BUILD) : undefined;

console.log(buildData);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: {
        "@vue-start/antd-pro": path.resolve(__dirname, "@vue-start/antd-pro/index"),
        "@vue-start/config": path.resolve(__dirname, "@vue-start/config/index"),
        "@vue-start/element-pro": path.resolve(__dirname, "@vue-start/element-pro/index"),
        "@vue-start/hooks": path.resolve(__dirname, "@vue-start/hooks/index"),
        "@vue-start/pro": path.resolve(__dirname, "@vue-start/pro/index"),
        "@vue-start/request": path.resolve(__dirname, "@vue-start/request/index"),
        "@vue-start/store": path.resolve(__dirname, "@vue-start/store/index"),
        "@vue-start/media/index.css": path.resolve(__dirname, "@vue-start/media/index.css"),
        "@vue-start/media": path.resolve(__dirname, "@vue-start/media/index"),
        "@vue-start/chart": path.resolve(__dirname, "@vue-start/chart/index"),
        //
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      vue(),
      tsxWithCode(),
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
      createHtml(omit(env, "VITE_DEV")),
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
              "dayjs",
              //
              "@vue-start/hooks",
              "@vue-start/request",
              "@vue-start/pro",
            ],
          },
        }
      : undefined,
  };
});
