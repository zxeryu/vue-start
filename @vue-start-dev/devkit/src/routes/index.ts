/**
 * 根据目录生成routes json
 *
 */
import { Dirent, existsSync, readdirSync } from "fs";
import { endsWith, filter, indexOf, map, size, some, camelCase, join, toLower, upperFirst, forEach } from "lodash";
import { resolve } from "path";

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

type TRouteOptions = {
  ignoreDirs?: string[];
  ignoreFiles?: string[];
  fileTypes?: string[];
  importPrefix?: string;
};

type NodeType = {
  parent: string[];
  name: string;
  //文件夹从属于某个组件
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
  return map(
    filter(files, (file: Dirent) => {
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
    }),
    (file: Dirent) => {
      const name = file.name;
      if (file.isDirectory()) {
        const nextParent = [...parent, name];
        return {
          parent: nextParent,
          name,
          children: readFileData(resolve(path, name), nextParent, options),
        };
      }
      return { parent, name };
    },
  );
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

  //2.屏蔽包含文件夹的文件
  const realData: NodeType[] = [];
  forEach(validData, (item) => {
    const name = dirOrFileName(item.name);
    if (!item.children && dirMap[name]) {
      return;
    }
    //文件夹
    if (item.children) {
      const fileName = fileNameMap[name];
      realData.push({ ...item, comp: fileName });
      return;
    }
    realData.push(item);
  });

  return map(realData, (item) => {
    const path = dirOrFileName(item.name);
    //name根据层级拼接而成
    const name = camelCase(join([...map(parent, ({ name }) => name), path]));
    const nextItem = { name: upperFirst(name), path };
    if (size(item.children) > 0) {
      const arr = [...map(parent, (item) => item.name), item.comp];
      let obj = null;
      if (item.comp) {
        obj = { component: `$rm$() => import('${options.importPrefix + "/" + join(arr, "/")}')$rm$` };
      }
      return {
        ...nextItem,
        ...obj,
        children: fileToRoute(item.children as NodeType[], [...parent, item], options),
      };
    }
    const arr = [...map(parent, (item) => item.name), item.name];
    return {
      ...nextItem,
      component: `$rm$() => import('${options.importPrefix + "/" + join(arr, "/")}')$rm$`,
    };
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
    nameList.push(item.name);
    if (item.children && size(item.children) > 0) {
      routeDataNameList(item.children, nameList);
    }
  });
};

const nameListToStr = (list: string[]) => {
  let str = "";
  forEach(list, (item) => {
    str += `export const ${item} = "${item}";`;
  });
  return str;
};

export const createRouteData = (
  path: string,
  options: TRouteOptions = {
    ignoreDirs: ["component", "components"],
    ignoreFiles: ["component", "components"],
    fileTypes: [".js", ".jsx", ".ts", ".tsx", ".vue"],
    importPrefix: "@/views",
  },
) => {
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
