import axios, { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from "axios";
import { paramsSerializer, protocolPrefix, transformRequest, transformResponse } from "./utils";
import { set, forEach, Dictionary, startsWith, split } from "lodash";

export type TRequestInterceptor = (
  request: AxiosInterceptorManager<AxiosRequestConfig>,
  response: AxiosInterceptorManager<AxiosResponse>,
) => void;

const setDefaultContentType = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (!config.headers || !config.headers["Content-Type"]) {
    set(config, ["headers", "Content-Type"], "application/json");
  }
  return config;
};

const createCompleteUrl = (baseUrls: Dictionary<string>) => (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (!startsWith(config.url, "http:") && !startsWith(config.url, "https:")) {
    const firstPart = split(config.url, "/")[1];
    config.url = `${protocolPrefix(baseUrls[firstPart])}${config.url}`;
  }
  return config;
};

export const createAxiosInstance = (
  options: AxiosRequestConfig,
  interceptors: TRequestInterceptor[],
  baseUrls?: Dictionary<string>,
): AxiosInstance => {
  const client = axios.create({
    ...options,
    paramsSerializer,
    transformRequest,
    transformResponse,
  });

  client.interceptors.request.use(setDefaultContentType);
  baseUrls && client.interceptors.request.use(createCompleteUrl(baseUrls));

  forEach(interceptors, (interceptor) => {
    interceptor(client.interceptors.request, client.interceptors.response);
  });

  return client;
};
