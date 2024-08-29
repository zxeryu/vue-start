import { camelCase, filter, forEach, get, groupBy, isString, join, map, reduce, replace, size } from "lodash";

const isValidParamName = (paramName: string) => {
  return isString(paramName) && paramName.indexOf(".") === -1;
};

export type TApiNameFun = (
  methodDesc: Record<string, any>,
  methodType: string,
  path: string,
  basePath: string,
) => string;

const getApiName = (methodType: string, path: string, basePath: string) => {
  const str = path.replace(basePath, "");
  //根据type和path生成name
  return camelCase(`${methodType}/${str}`);
};

const createApiList = (
  data: Record<string, any>,
  customApiName: TApiNameFun,
  basePath: string,
  ignorePathMap?: Record<string, boolean>,
) => {
  const apiList: Record<string, any>[] = [];
  const apiNameSet = new Set();
  forEach(data, (nodule, path) => {
    if (ignorePathMap && ignorePathMap[path]) {
      return;
    }
    forEach(nodule, (methodDesc, methodType) => {
      const apiName = customApiName
        ? customApiName(methodDesc, methodType, path, basePath)
        : getApiName(methodType, path, basePath);

      if (apiNameSet.has(apiName)) {
        throw new Error(`生成接口名称(${apiName})重复：path=${path} method=${methodType}`);
      }
      apiNameSet.add(apiName);
      const allPath = `${basePath || ""}${path}`;
      const api = {
        name: apiName,
        path: replace(allPath, new RegExp("{", "g"), "${extra."),
        method: methodType,
        tag: get(methodDesc, ["tags", 0]),
        summary: get(methodDesc, "summary") || get(methodDesc, "operationId"),
        query: filter(methodDesc.parameters, (item) => {
          return (isValidParamName(item.name) && item.in === "query") || item.in === "path";
        }),
        //兼容open-api 3.0
        needBody: !!methodDesc.requestBody,
      };

      apiList.push(api);
    });
  });
  return apiList;
};

const SChar = "`";

const generateDesc = (list: Record<string, any>[]) => {
  let str = "";
  const query = map(
    filter(list, (item) => item.in === "query"),
    (item) => ` ${item.name}, //${replace(item.description, /\n/g, "")}`,
  );
  if (size(query) > 0) {
    str += `
query:{
${join(query, "\n")}
}`;
  }
  const path = map(
    filter(list, (item) => item.in === "path"),
    (item) => ` ${item.name}, //${replace(item.description, /\n/g, "")}`,
  );
  if (size(path) > 0) {
    str += `
path:{
${join(path, "\n")}
}`;
  }
  return str;
};

const generateApiCode = (api: Record<string, any>) => {
  const isBody = api.method === "post" || api.method === "put" || api.needBody;
  //params
  const params = ["...extra"];
  if (isBody) {
    params.unshift("body");
  }
  const paramStr = size(params) > 0 ? `{${join(params, ",")}}` : ``;
  //data
  const dataStr = isBody ? "data: body" : "";

  //参数说明
  const desc = generateDesc(api.query);

  return `
/**
* ${api.summary}${desc}
*/
export const ${api.name} = createRequestActor('${api.name}',(${paramStr})=>{
  return {
    method: '${api.method}',
    url: ${SChar}${api.path}${SChar},
    params: extra,${dataStr}
  }
});
  `;
};

const generateFragment = (apiList: Record<string, any>[], tag: string) => {
  const apiListStr = map(apiList, (api) => {
    return generateApiCode(api);
  });
  return `
// ******************************** ${tag} **************************************
${join(apiListStr, "")}  
  `;
};

export const transformApiData = (data: Record<string, any>, customApiName: TApiNameFun, basePath: string) => {
  const apiList = createApiList(data, customApiName, basePath);

  const tagDataGroup = groupBy(apiList, "tag");

  const apiGroupStr = map(tagDataGroup, (apiList, tag) => {
    return generateFragment(apiList, tag);
  });

  return `
import { createRequestActor } from "@vue-start/request"

${join(apiGroupStr, "")}  
  `;
};

export type TClientResult = {
  apiList: Record<string, any>[];
  apiStr: string;
  apiJson: string;
};

export const createApiData = (
  data: Record<string, any>,
  customApiName: TApiNameFun,
  { basePath, ignorePaths, selectPaths }: { basePath: string; ignorePaths?: string[]; selectPaths?: string[] },
): TClientResult => {
  const ignorePathMap = reduce(ignorePaths, (pair, item) => ({ ...pair, [item]: true }), {});
  const selectPathMap = reduce(selectPaths, (pair, item) => ({ ...pair, [item]: true }), {});

  const allList = createApiList(data, customApiName, basePath, ignorePathMap);
  const apiList = selectPaths
    ? filter(allList, (item) => {
        return get(selectPathMap, item.path);
      })
    : allList;

  const apiJson = map(apiList, (item) => {
    const queryInPath = map(
      filter(item.query, (i) => i.in === "path"),
      (i) => i.name,
    );
    return {
      name: item.name,
      requestConfig: { method: item.method, url: item.path },
      extra: size(queryInPath) > 0 ? { queryInPath } : undefined,
    };
  });

  const tagDataGroup = groupBy(apiList, "tag");
  const apiGroupStr = map(tagDataGroup, (apiList, tag) => {
    return generateFragment(apiList, tag);
  });
  const apiStr = `
import { createRequestActor } from "@vue-start/request"

${join(apiGroupStr, "")}  
  `;

  return { apiList, apiStr, apiJson: JSON.stringify(apiJson) };
};
