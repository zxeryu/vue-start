import { camelCase, filter, forEach, get, groupBy, isString, join, map, replace, size } from "lodash";

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

const createApiList = (data: Record<string, any>, customApiName: TApiNameFun, basePath: string) => {
  const apiList: Record<string, any>[] = [];
  const apiNameSet = new Set();
  forEach(data, (nodule, path) => {
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
        path: replace(allPath, new RegExp("{", "g"), "${"),
        method: methodType,
        tag: get(methodDesc, ["tags", 0]),
        summary: get(methodDesc, "summary"),
        query: filter(methodDesc.parameters, (item) => {
          return (isValidParamName(item.name) && item.in === "query") || item.in === "path";
        }),
      };

      apiList.push(api);
    });
  });
  return apiList;
};

const dealKeywords = (name: string) => {
  if (name === "var") {
    return `${name}$`;
  }
  return name;
};

const SChar = "`";

const generateApiCode = (api: Record<string, any>) => {
  const isBody = api.method === "post" || api.method === "put";
  //params
  const query = map(api.query, (item) => `${dealKeywords(item.name)}//${replace(item.description, /\n/g, "")}\n`);
  const params = isBody ? [...query, "body"] : query;
  const paramStr = size(params) > 0 ? `{${join(params, ",")}}` : ``;
  //query
  const qs = map(
    filter(api.query, (item) => item.in === "query"),
    (item) => dealKeywords(item.name),
  );
  const queryStr = size(qs) > 0 ? `params: { ${join(qs, ",")} }` : ``;
  //data
  const dataStr = isBody ? `data: body` : ``;

  return `
// ${api.summary}  
export const ${api.name} = createRequestActor('${api.name}',(${paramStr})=>{
  return {
    method: '${api.method}',
    url: ${SChar}${api.path}${SChar},
    ${queryStr}${queryStr ? "," : ""}${dataStr}
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

export const createApiData = (data: Record<string, any>, customApiName: TApiNameFun, basePath: string) => {
  const apiList = createApiList(data, customApiName, basePath);

  const apiJson = map(apiList, (item) => {
    const queryInPath = map(
      filter(item.query, (i) => i.in === "path"),
      (i) => i.name,
    );
    return {
      name: item.name,
      requestConfig: {
        method: item.method,
        url: item.path,
      },
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
