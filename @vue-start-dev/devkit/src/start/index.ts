import { TRuntimeConfig, TStartConfig } from "./type";
import { join } from "path";
import { existsSync } from "fs";
import { createRouteData } from "../routes";
import { drop, filter, forEach, head, size, upperFirst } from "lodash";
import { generate } from "../file";

/**
 * 读取config文件
 */
const loadConfig = (cwd: string): TStartConfig => {
  const configPath = join(cwd, "start.config.js");
  if (!existsSync(configPath)) {
    throw new Error("no start.config.js");
  }
  const config = require(configPath);
  return config as TStartConfig;
};

const formatCode = (str: string) => {
  try {
    return require("prettier").format(str);
  } catch (e) {
    console.error(e);
  }
  return str;
};

const generateRouteFile = (cwd: string, config: TRuntimeConfig) => {
  const routeConfig = config.route;
  if (!routeConfig) return;

  const target = head(config.argv);

  const list = target ? filter(routeConfig.list, (item) => item.name === target) : routeConfig.list;

  if (size(list) <= 0) {
    throw new Error("can not find valid item");
  }

  forEach(list, (item) => {
    const viewPath = join(cwd, ...item.path);
    if (!existsSync(viewPath)) {
      return;
    }
    const routeResult = createRouteData(viewPath, {
      ...routeConfig.options,
      importPrefix: item.importPrefix || routeConfig.options?.importPrefix,
    });

    const { routeStr, routeNameStr } = item.convertData ? item.convertData(routeResult) : routeResult;

    const routeName = item.generateName || item.name;
    const routePath = item.generatePath || ["src", "router"];

    const fileType = routeConfig.fileType || ".js";

    //路由文件
    generate(join(cwd, ...routePath, `${routeName}${fileType}`), formatCode(routeStr));
    //路由名称文件
    if (item.routeNames) {
      generate(join(cwd, ...routePath, `${upperFirst(routeName)}Names${fileType}`), formatCode(routeNameStr));
    }
  });
};

export const start = () => {
  if (process.argv.length < 3) {
    throw new Error("need action. like: route,client,dev");
  }

  const cwd = process.cwd();
  const config = loadConfig(cwd);

  const runtimeConfig: TRuntimeConfig = { ...config, argv: drop(process.argv, 3) };

  const action = process.argv[2];

  if (action === "route") {
    generateRouteFile(cwd, runtimeConfig);
  }
};
