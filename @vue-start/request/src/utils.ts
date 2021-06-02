import { startsWith } from "lodash";
import { stringify } from "querystring";
import { forEach, isArray, isObject } from "lodash";

export const getProtocol = (): string => globalThis.location.protocol;

export const isHttps = (): boolean => getProtocol() === "https:";

export const protocolPrefix = (url = ""): string => {
  if (startsWith(url, "http:") || startsWith(url, "https:")) {
    return url;
  }
  return getProtocol() + url;
};

const getContentType = (headers: any = {}) => headers["Content-Type"] || headers["content-type"] || "";

export const isContentTypeMultipartFormData = (headers: unknown): boolean =>
  getContentType(headers).includes("multipart/form-data");
export const isContentTypeFormURLEncoded = (headers: unknown): boolean =>
  getContentType(headers).includes("application/x-www-form-urlencoded");
export const isContentTypeJSON = (headers: unknown): boolean => {
  return getContentType(headers).includes("application/json");
};

export const paramsSerializer = (params: any) => {
  const data = {} as any;

  const add = (k: string, v: string) => {
    if (typeof v === "undefined" || String(v).length === 0) {
      return;
    }

    if (data[k]) {
      data[k] = ([] as string[]).concat(data[k]).concat(v);
      return;
    }

    data[k] = v;
  };

  const appendValue = (k: string, v: any) => {
    if (isArray(v)) {
      forEach(v, (item) => appendValue(k, item));
    } else if (isObject(v)) {
      add(k, JSON.stringify(v));
    } else {
      add(k, v);
    }
  };

  forEach(params, (v, k) => appendValue(k, v));

  return stringify(data);
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
        formData.append(k, v);
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

export const transformResponse = (data: any, headers: any) => {
  if (isContentTypeJSON(headers)) {
    return JSON.parse(data);
  }
  return data;
};
