import { isUndefined, forEach, isArray, isObject, omit, isNull, get, size, pick, startsWith, endsWith } from "lodash";
import { IRequestActor } from "./createRequest";
import { AxiosRequestConfig } from "axios";

const getContentType = (headers: any = {}) => headers["Content-Type"] || headers["content-type"] || "";

export const isContentTypeMultipartFormData = (headers: any) => getContentType(headers).includes("multipart/form-data");
export const isContentTypeFormURLEncoded = (headers: any) =>
  getContentType(headers).includes("application/x-www-form-urlencoded");

export const isContentTypeJSON = (headers: any) => {
  return getContentType(headers).includes("application/json");
};

export const paramsSerializer = (params: any) => {
  const searchParams = new URLSearchParams();

  const append = (k: string, v: any) => {
    if (isArray(v)) {
      forEach(v, (vv) => {
        append(k, vv);
      });
      return;
    }
    if (isObject(v)) {
      append(k, JSON.stringify(v));
      return;
    }
    if (isNull(v)) {
      return;
    }
    if (isUndefined(v) || `${v}`.length == 0) {
      return;
    }
    searchParams.append(k, `${v}`);
  };

  forEach(params, (v, k) => {
    append(k, v);
  });

  return searchParams.toString();
};

export const transformRequest = (data: any, headers: any) => {
  if (isContentTypeMultipartFormData(headers)) {
    const formData = new FormData();

    const appendValue = (k: string, v: any) => {
      if (v instanceof File || v instanceof Blob) {
        formData.append(k, v);
      } else if (isArray(v)) {
        forEach(v, (item) => appendValue(k, item));
      } else if (isObject(v)) {
        formData.append(k, JSON.stringify(v));
      } else {
        formData.append(k, v as string);
      }
    };

    forEach(data, (v, k) => appendValue(k, v));

    return formData;
  }

  if (isContentTypeFormURLEncoded(headers)) {
    return paramsSerializer(data);
  }

  if (isArray(data) || isObject(data)) {
    return JSON.stringify(data);
  }

  return data;
};

export const transformResponse = (data: unknown, headers: { [k: string]: any }) => {
  if (isContentTypeJSON(headers)) {
    return JSON.parse(data as string);
  }
  return data;
};

export const getRequestConfig = (actor: IRequestActor): AxiosRequestConfig => {
  let axiosRequestConfig = actor.requestConfig!;
  if (actor.requestFromReq) {
    axiosRequestConfig = actor.requestFromReq(actor.req || {});
  } else if (actor.req) {
    const queryInPath = get(actor, ["extra", "queryInPath"], []);
    if (size(queryInPath) > 0) {
      //转换url
      const qps = pick(actor.req, queryInPath);
      let url: string = axiosRequestConfig.url!;
      forEach(queryInPath, (name) => {
        url = url.replace("${" + name + "}", qps[name]);
      });
      axiosRequestConfig.url = url;
    }
    axiosRequestConfig.params = omit(actor.req, "body", ...queryInPath);
    axiosRequestConfig.data = actor.req.body;
  }
  return axiosRequestConfig;
};

/**
 * get请求 可转换为url
 * @param actor
 * @param baseUrl
 */
export const toUrl = (actor: IRequestActor, baseUrl = "") => {
  const axiosConfig = getRequestConfig(actor);

  return `${baseUrl || axiosConfig?.baseURL || ""}${axiosConfig?.url || ""}?${paramsSerializer(axiosConfig?.params)}`;
};

/**
 * 补全url
 * @param url
 * @param prefix
 */
export const completeUrl = (url: string, prefix: string) => {
  if (!prefix) return url;
  let rePrefix = startsWith(prefix, "http") ? prefix : `${window.location.protocol}//${prefix}`;
  if (endsWith(rePrefix, "/") && startsWith(url, "/")) {
    rePrefix = rePrefix.substring(0, rePrefix.length - 1);
  }
  return `${rePrefix}${url}`;
};
