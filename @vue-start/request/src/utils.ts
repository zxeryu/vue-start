import { isUndefined, forEach, isArray, isObject, omit, isNull } from "lodash";
import { IRequestActor } from "./createRequest";

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

export const getRequestConfig = (actor: IRequestActor) => {
  let axiosRequestConfig = actor.requestConfig!;
  if (actor.requestFromReq) {
    axiosRequestConfig = actor.requestFromReq(actor.req || {});
  } else if (actor.req) {
    axiosRequestConfig.params = omit(actor.req, "body");
    axiosRequestConfig.data = actor.req.body;
  }
  return axiosRequestConfig;
};

export const toUrl = (actor: IRequestActor, baseUrl = "") => {
  const axiosConfig = getRequestConfig(actor);

  return `${baseUrl || axiosConfig?.baseURL || ""}${axiosConfig?.url || ""}?${paramsSerializer(axiosConfig?.params)}`;
};

export const generateId = () => {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
};
