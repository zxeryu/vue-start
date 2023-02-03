const { join } = require("path");
const prettier = require("prettier");
const { createRouteData, generate } = require("@vue-start-dev/devkit/dist");

const baseDir = process.cwd();

const defaultOptions = {
  ignoreDirs: ["component", "components", "demo", "demo-vue"],
  ignoreFiles: ["component", "components"],
  fileTypes: [".js", ".jsx", ".ts", ".tsx", ".vue"],
};

const generateRoutes = ({ name, path, importPrefix }) => {
  const opts = { ...defaultOptions, importPrefix };
  const { routeStr } = createRouteData(path, opts);
  const str = routeStr.replace(/.tsx/g, "");
  generate(join(baseDir, name, "router", `routes.ts`), prettier.format(str));
};

const RoutesMap = {
  src: {
    name: "src",
    path: join(baseDir, "src", "views"),
    importPrefix: "@/views",
  },
};

const targetName = process.argv[2];
if (!RoutesMap[targetName]) {
  throw new Error("请输入正确的路由配置名称");
}

generateRoutes(RoutesMap[targetName]);
