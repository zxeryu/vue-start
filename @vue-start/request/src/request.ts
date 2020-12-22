import { Dictionary, pickBy, isUndefined } from "lodash";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";

export type IMethod = "GET" | "DELETE" | "HEAD" | "POST" | "PUT" | "PATCH";

export interface IRequestOpts<T = any> {
  method: IMethod;
  url: string;
  headers?: Dictionary<any>;
  query?: T;
  data?: T;
}

export type TRequestFromReq = <T>(arg: T) => IRequestOpts;

export interface IRequestActor<TReq, TRes> {
  name: string;
  req?: TReq;
  res?: TRes;
  requestFromReq: (req: TReq) => IRequestOpts;
}

export const createRequestActor = <TReq, TRes>(
  name: string,
  requestFromReq: TRequestFromReq,
): IRequestActor<TReq, TRes> => {
  return { name, requestFromReq };
};

const requestConfig = <TReq>(config: IRequestOpts<TReq>): AxiosRequestConfig => {
  const { url, method, headers, query, data, ...otherConfig } = config;
  return {
    ...otherConfig,
    url,
    method,
    params: query,
    data,
    headers: pickBy(headers, (v) => !isUndefined(v)),
  };
};

const alterActorCancelTokenSource = (actor: any, cancelTokenSource: CancelTokenSource) => {
  actor.__CANCEL_TOKEN_SOURCE__ = cancelTokenSource;
};

export const cancelActorIfExists = (actor: any) => {
  actor.__CANCEL_TOKEN_SOURCE__?.cancel();
  actor.__CANCEL__ = true;
};

export const isCancelActor = (actor: any) => {
  return actor.__CANCEL__;
};

const createSource = (source?: CancelTokenSource) => {
  if (source && (source as any).increase) {
    (source as any).increase();
    return source;
  }

  const cancelTokenSource = axios.CancelToken.source();

  let used = 1;

  return {
    token: cancelTokenSource.token,
    increase() {
      used++;
    },
    cancel() {
      used--;

      if (used <= 0) {
        cancelTokenSource.cancel();
      }
    },
  };
};

export const createRequestFactory = <TReq>(client: AxiosInstance) => {
  const cachedRequest$: {
    [k: string]: {
      cancelTokenSource?: CancelTokenSource;
      config: AxiosRequestConfig;
      source$: Promise<AxiosResponse>;
    };
  } = {};

  return (actor: IRequestActor<TReq, any>) => {
    const axiosRequestConfig = requestConfig(actor.requestFromReq(actor?.req || ({} as any)));
    const uri = axiosRequestConfig.method?.toLowerCase() === "get" && client.getUri(axiosRequestConfig);
    const request = () => {
      if (uri) {
        const c = cachedRequest$[uri];
        if (c) {
          alterActorCancelTokenSource(actor, createSource(c.cancelTokenSource));
          return c.source$;
        }

        const cancelTokenSource = createSource();
        alterActorCancelTokenSource(actor, cancelTokenSource);
        axiosRequestConfig.cancelToken = cancelTokenSource.token;
        return (cachedRequest$[uri] = {
          cancelTokenSource,
          config: axiosRequestConfig,
          source$: client.request(axiosRequestConfig),
        }).source$;
      }

      const cancelTokenSource = createSource();
      axiosRequestConfig.cancelToken = cancelTokenSource?.token;
      alterActorCancelTokenSource(actor, cancelTokenSource);
      return client.request(axiosRequestConfig);
    };

    request.clear = () => {
      if (uri) {
        delete cachedRequest$[uri];
      }
    };
    request.config = axiosRequestConfig;

    return request;
  };
};

export const fakeCancelRequest = (client: AxiosInstance, axiosRequestConfig: AxiosRequestConfig) => {
  const source = axios.CancelToken.source();
  source.cancel();
  return client.request({
    ...axiosRequestConfig,
    cancelToken: source.token,
  });
};
