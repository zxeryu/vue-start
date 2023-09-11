import { inject, App, provide } from "vue";
import axios, { AxiosError, AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from "axios";
import { paramsSerializer, transformRequest, transformResponse } from "./utils";
import { forEach, get, set, clone } from "lodash";
import { Subject } from "rxjs";
import { createRequestObservable, IRequestActor } from "./createRequest";
import { useEffect } from "@vue-start/hooks";

const ProvideKey = "$axios";

export type DispatchRequestType = (
  actor: IRequestActor,
  params?: IRequestActor["req"],
  extra?: IRequestActor["extra"],
) => IRequestActor;

export type RequestProvideType = {
  client: AxiosInstance;
  requestSubject$: Subject<IRequestActor>;
  dispatchRequest: DispatchRequestType;
};

export const useRequestProvide = (): RequestProvideType => inject(ProvideKey) as RequestProvideType;

export type TRequestInterceptor = (
  request: AxiosInterceptorManager<AxiosRequestConfig>,
  response: AxiosInterceptorManager<AxiosResponse>,
) => void;

export const ContentTypeInterceptor: TRequestInterceptor = (request) => {
  request.use((requestConfig) => {
    if (!get(requestConfig, ["headers", "Content-Type"])) {
      set(requestConfig, ["headers", "Content-Type"], "application/json");
    }
    return requestConfig;
  });
};

export type ResponseOpts = {
  convertResponse?: (actor: IRequestActor, response: AxiosResponse) => IRequestActor;
  convertError?: (actor: IRequestActor, error: AxiosError) => IRequestActor;
};

const createClient = (options: AxiosRequestConfig, interceptors: TRequestInterceptor[], opts?: ResponseOpts) => {
  // client
  const client = axios.create({
    paramsSerializer,
    transformResponse,
    transformRequest,
    ...options,
  });
  forEach(interceptors, (interceptor) => {
    interceptor(client.interceptors.request, client.interceptors.response);
  });
  //全局request订阅对象
  const requestSubject$ = new Subject<IRequestActor>();
  //发送request方法
  const dispatchRequest: DispatchRequestType = (actor, params, extra) => {
    const operatorActor = clone(actor);
    //重置Actor （actor 对象多次发起请求时，需要将stage、res、err重置，以防影响）
    operatorActor.stage = undefined;
    operatorActor.res = undefined;
    operatorActor.err = undefined;

    operatorActor.req = params;
    operatorActor.extra = extra || operatorActor.extra;
    requestSubject$.next(operatorActor);

    return operatorActor;
  };
  //全局订阅
  const sub = createRequestObservable(requestSubject$, client, opts).subscribe((actor) => {
    requestSubject$.next(actor);
  });

  return { client, requestSubject$, dispatchRequest, sub };
};

export const provideRequest = (
  options: AxiosRequestConfig,
  interceptors: TRequestInterceptor[],
  opts?: ResponseOpts,
) => {
  const { client, requestSubject$, dispatchRequest, sub } = createClient(options, interceptors, opts);

  provide<RequestProvideType>(ProvideKey, { client, requestSubject$, dispatchRequest });

  useEffect(() => {
    return () => {
      sub && sub.unsubscribe();
    };
  }, []);
};

export const createRequest =
  (options: AxiosRequestConfig, interceptors: TRequestInterceptor[], opts?: ResponseOpts) => (app: App) => {
    const { client, requestSubject$, dispatchRequest } = createClient(options, interceptors, opts);

    //vue挂载request对象
    app.provide<RequestProvideType>(ProvideKey, { client, requestSubject$, dispatchRequest });
  };
