import { TRuntimeConfig } from "../start/type";
import { filter, forEach, head, size, upperFirst } from "lodash";
import { join } from "path";
import { existsSync } from "fs";
import { createRouteData } from "./index";
import { generate } from "../file";
import { formatCode } from "../util";

export const generateRouteFile = (cwd: string, config: TRuntimeConfig) => {
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
