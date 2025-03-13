import { defineConfig, loadEnv } from "vite";
import { omit } from "lodash";
import path from "path";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import htmlPlugin from "vite-plugin-html-config";
import { createHtml } from "./plugin/html";

import { tsxWithCode } from "./plugin/tsxWithCode";

// @ts-ignore
import { cssToCls } from "./@vue-start-dev/devkit";

import { dirAlias } from "./tool/script";

const devData = process.env.VITE_DEV ? JSON.parse(process.env.VITE_DEV) : undefined;
const buildData = process.env.VITE_BUILD ? JSON.parse(process.env.VITE_BUILD) : undefined;

console.log(buildData);

const alias = dirAlias();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: {
        ...alias,
        //
        "@": path.resolve(__dirname, "src"),
        "@cheng": path.resolve(__dirname, "src-cheng"),
      },
    },
    plugins: [
      vue(),
      devData ? cssToCls() : undefined,
      devData ? tsxWithCode() : undefined,
      vueJsx(),
      devData
        ? htmlPlugin({
            scripts: [{ src: `/${devData.entry}/index.ts`, type: "module" }],
          })
        : undefined,
      createHtml(omit(env, "VITE_DEV")),
    ],
    build: buildData
      ? {
          copyPublicDir: false,
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
              "@emotion/css",
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
              "express",
              "dayjs",
              "prettier",
              "polished",
              //
              "@vue-start/antd-pro",
              "@vue-start/chart",
              "@vue-start/config",
              "@vue-start/css",
              "@vue-start/element-pro",
              "@vue-start/hooks",
              "@vue-start/map",
              "@vue-start/media",
              "@vue-start/persist",
              "@vue-start/pro",
              "@vue-start/request",
              "@vue-start/store",
              //chart
              "echarts",
              //media preview
              "docx-preview",
              "x-data-spreadsheet",
              "xlsx",
              //map
              "@amap/amap-jsapi-loader",
              //persist
              "localforage",
              //express
              "express",
              "body-parser"
            ],
          },
        }
      : undefined,
  };
});
