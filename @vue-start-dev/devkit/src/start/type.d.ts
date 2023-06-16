import { TRouteOptions, TRouteResult } from "../routes";

type TRouteItem = {
  name: string;
  path: string[]; //例如：["src","views"]
  importPrefix?: TRouteOptions["importPrefix"]; //路由文件路径前缀
  //生成文件相关
  generateName?: string; //生成文件名字，缺省取 name
  generatePath?: string[]; //生成文件路径，缺省 ["src","router"]
  routeNames?: boolean; //是否生成Route Name
  convertData?: (data: TRouteResult) => TRouteResult;
};

export type TStartConfig = {
  route?: {
    fileType?: string;
    options?: TRouteOptions;
    list: TRouteItem[];
  };
};

export type TRuntimeConfig = TStartConfig & {
  argv: string[];
};
