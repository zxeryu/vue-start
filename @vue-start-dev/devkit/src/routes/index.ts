/**
 * 根据目录生成routes json
 *
 */
import { Dirent, existsSync, readdirSync, readFileSync } from "fs";
import { endsWith, filter, indexOf, map, size, some, camelCase, join, toLower, upperFirst, forEach, get } from "lodash";
import { resolve } from "path";

// 获取文件夹或文件的名字；小写处理；
const dirOrFileName = (name: string) => {
  if (!name) {
    return name;
  }
  if (name.indexOf(".") <= -1) {
    return toLower(name);
  }
  const path = name.substring(0, name.indexOf("."));
  return toLower(path);
};

export type TRouteOptions = {
  ignoreDirs?: string[];
  ignoreFiles?: string[];
  fileTypes?: string[];
  importPrefix?: string;
};

type NodeType = {
  parent: string[];
  name: string;
  //route.json 文件中配置
  extra?: Record<string, any>;
  //文件夹从属于某个组件（文件夹对应的路由对象的component）
  comp?: string;
  //文件夹
  children?: NodeType[];
};

//读取目录下的文件及文件夹
const readFileData = (path: string, parent: string[] = [], options: TRouteOptions): NodeType[] => {
  if (!existsSync(path)) {
    return [];
  }
  const files: Dirent[] = readdirSync(path, { withFileTypes: true });

  const validFiles = filter(files, (file: Dirent) => {
    const name = file.name;
    //屏蔽配置的目录
    if (options.ignoreDirs && file.isDirectory()) {
      if (indexOf(options.ignoreDirs, name) !== -1) {
        return false;
      }
    }
    //屏蔽配置的文件
    if (options.ignoreFiles && file.isFile()) {
      const fileName = dirOrFileName(name);
      if (indexOf(options.ignoreFiles, fileName) !== -1) {
        return false;
      }
    }
    //只处理配置了文件类型的数据
    if (options.fileTypes && file.isFile()) {
      return some(options.fileTypes, (type) => {
        return endsWith(name, type);
      });
    }
    return true;
  });

  //读取route.json
  let extraData: Record<string, any> | undefined;
  const extraPath = resolve(path, "route.json");
  if (existsSync(extraPath)) {
    try {
      extraData = JSON.parse(String(readFileSync(extraPath)));
    } catch (e) {
      console.error(e);
    }
  }

  return map(validFiles, (file: Dirent) => {
    const name = file.name;
    const extra = get(extraData, name);
    if (file.isDirectory()) {
      const nextParent = [...parent, name];
      return {
        parent: nextParent,
        name,
        children: readFileData(resolve(path, name), nextParent, options),
        extra,
      };
    }
    return { parent, name, extra };
  });
};

type RouteType = {
  name: string;
  path: string;
  component?: string;
  children?: RouteType[];
};

const fileToRoute = (data: NodeType[], parent: NodeType[] = [], options: TRouteOptions): RouteType[] => {
  //剔除空文件夹数据
  const validData = filter(data, (item) => {
    if (item.children && size(item.children) <= 0) {
      return false;
    }
    return true;
  });

  //标记从属关系
  const fileMap: { [key: string]: true } = {};
  const fileNameMap: { [key: string]: string } = {};
  const dirMap: { [key: string]: true } = {};
  forEach(validData, (item) => {
    if (item.children) {
      dirMap[item.name] = true;
    } else {
      fileMap[item.name] = true;
      const name = dirOrFileName(item.name);
      fileNameMap[name] = item.name;
    }
  });

  //处理文件夹与文件同名情况，即：父路由存在component的情况
  const realData: NodeType[] = [];
  forEach(validData, (item) => {
    const name = dirOrFileName(item.name);
    //屏蔽包含文件夹的文件
    if (!item.children && dirMap[name]) {
      return;
    }
    //文件夹 对象赋值 comp
    if (item.children && fileNameMap[name]) {
      realData.push({ ...item, comp: fileNameMap[name] });
      return;
    }
    realData.push(item);
  });

  return map(realData, (item) => {
    const path = dirOrFileName(item.name);
    //name根据层级拼接而成
    const name = camelCase(join([...map(parent, ({ name }) => name), path]));
    const nextItem = { name: upperFirst(name), path, ...item.extra };
    //父级路由
    if (size(item.children) > 0) {
      let obj = null;
      if (item.comp) {
        const arr = [...map(parent, (item) => item.name), item.comp];
        obj = { component: `$rm$() => import('${options.importPrefix + "/" + join(arr, "/")}')$rm$` };
      }
      const children = fileToRoute(item.children as NodeType[], [...parent, item], options);
      return { ...nextItem, ...obj, children };
    }
    //叶子路由
    const arr = [...map(parent, (item) => item.name), item.name];
    const component = `$rm$() => import('${options.importPrefix + "/" + join(arr, "/")}')$rm$`;
    return { ...nextItem, component };
  }) as RouteType[];
};

/**
 * 生成路由js内容
 * @param routeData
 */
const routeDataToStr = (routeData: RouteType[]) => {
  const jsonStr = JSON.stringify(routeData);
  const content = jsonStr.replace(/"\$rm\$/g, "").replace(/\$rm\$"/g, "");
  return `export const routes = ${content}`;
};

/**
 * 获取所有路由name名称
 * @param routeData
 * @param nameList
 */
const routeDataNameList = (routeData: RouteType[], nameList: string[]) => {
  forEach(routeData, (item) => {
    if (item.children && size(item.children) > 0) {
      routeDataNameList(item.children, nameList);
    } else {
      nameList.push(item.name);
    }
  });
};

const nameListToStr = (list: string[]) => {
  let str = "";
  forEach(list, (item) => {
    str += `${item} : "${item}",`;
  });
  return `export const RouteNames = {
    ${str}
  }`;
};

export type TRouteResult = {
  routeData: RouteType[];
  routeStr: string;
  routeNameStr: string;
};

export const createRouteData = (
  path: string,
  options: TRouteOptions = {
    ignoreDirs: ["component", "components"],
    ignoreFiles: ["component", "components"],
    fileTypes: [".js", ".jsx", ".ts", ".tsx", ".vue"],
    importPrefix: "@/views",
  },
): TRouteResult => {
  const fileData = readFileData(path, [], options);
  const routeData = fileToRoute(fileData, [], options);
  //路由内容
  const routeStr = routeDataToStr(routeData);
  const routeNameList: string[] = [];
  routeDataNameList(routeData, routeNameList);
  //路由名称
  const routeNameStr = nameListToStr(routeNameList);

  return { routeData, routeStr, routeNameStr };
};
