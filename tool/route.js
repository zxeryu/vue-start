const { join } = require("path");
const prettier = require("prettier");
const { createRouteData, generate } = require("@vue-start-dev/devkit/dist");

const baseDir = process.cwd();

const defaultOptions = {
  ignoreDirs: ["component", "components"],
  ignoreFiles: ["component", "components"],
  fileTypes: [".js", ".jsx", ".ts", ".tsx", ".vue"],
};

const generateRoutes = ({ name, path, importPrefix }) => {
  const opts = { ...defaultOptions, importPrefix };
  const { routeStr } = createRouteData(path, opts);
  generate(join(baseDir, name, "router", `routes.ts`), prettier.format(routeStr));
};

const RoutesMap = {
  src: {
    name: "src",
    path: join(baseDir, "src", "views"),
    importPrefix: "@/views",
  },
  "src-el": {
    name: "src-el",
    path: join(baseDir, "src-el", "views"),
    importPrefix: "@el/views",
  },
};

const targetName = process.argv[2];
if (!RoutesMap[targetName]) {
  throw new Error("请输入正确的路由配置名称");
}

generateRoutes(RoutesMap[targetName]);
