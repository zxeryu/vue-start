import { TRouteOptions, TRouteResult } from "../routes";
import { TApiNameFun, TClientResult } from "../clients";

type TRouteItem = {
  name: string;
  path: string[]; //例如：["src","views"]
  options?: TRouteOptions;
  //生成文件相关
  generateName?: string; //生成文件名字，缺省取 name
  generatePath?: string[]; //生成文件路径，缺省 ["src","router"]
  routeNames?: boolean; //是否生成Route Name
  convertData?: (data: TRouteResult) => TRouteResult;
};

type TClientItem = {
  name: string;
  url: string; //文档地址
  basePath: string; //api前缀
  selectPaths?: string[]; //选择的服务
  ignorePaths?: string[]; //屏蔽掉的服务
  generateName?: string; //生成文件名字，缺省取 name
  generatePath?: string[]; //生成文件路径，缺省 ["src","clients"]
  convertData?: (data: TClientResult) => TClientResult;
  convertPaths?: (data: any) => Record<string, any>[];
  customApiName?: TApiNameFun;
};

export type TStartConfig = {
  route?: {
    fileType?: string;
    options?: TRouteOptions;
    list: TRouteItem[];
  };
  client?: {
    fileType?: string;
    list: TClientItem[];
  };
};

export type TRuntimeConfig = TStartConfig & {
  argv: string[];
};
