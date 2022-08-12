import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import VuePlugin from "rollup-plugin-vue";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.es.js",
        format: "es",
        entryFileNames: "[name].es.js",
        chunkFileNames: "[name]-[hash].es.js",
      },
    ],
    plugins: [
      commonjs(),
      resolve({
        extensions: [".ts", ".tsx", ".js"],
      }),
      VuePlugin(),
      babel({
        configFile: "../../babel.config.json",
        babelHelpers: "bundled",
        extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx"],
      }),
    ],
    external: [
      "element-plus",
      "lodash",
      "vue",
      "rxjs",
      "rxjs/operators",
      "@vue-start/hooks",
      "@vue-start/request",
      "@vue-start/pro",
    ],
  },
  {
    input: "../../.tmp/@vue-start/element-pro/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
