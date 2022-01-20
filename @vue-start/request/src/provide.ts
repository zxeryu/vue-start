import { inject, App } from "vue";
import axios, { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from "axios";
import { paramsSerializer, transformRequest, transformResponse } from "./utils";
import { forEach, get, set, clone } from "lodash";
import { Subject } from "rxjs";
import { createRequestObservable, IRequestActor } from "./createRequest";

const ProvideKey = "$axios";

export type DispatchRequestType = (
  actor: IRequestActor,
  params?: IRequestActor["req"],
  extra?: IRequestActor["extra"],
) => void;

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

export const createRequest = (options: AxiosRequestConfig, interceptors: TRequestInterceptor[]) => (app: App) => {
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
    operatorActor.req = params;
    operatorActor.extra = extra;
    requestSubject$.next(operatorActor);
  };

  //全局订阅
  createRequestObservable(requestSubject$, client).subscribe((actor) => {
    requestSubject$.next(actor);
  });

  //vue挂载request对象
  app.provide<RequestProvideType>(ProvideKey, { client, requestSubject$, dispatchRequest });
};
