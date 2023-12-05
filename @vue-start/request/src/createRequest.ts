import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from "axios";
import {
  merge as rxMerge,
  Observable,
  filter as rxFilter,
  from as rxFrom,
  of as rxOf,
  map as rxMap,
  catchError as rxCatchError,
  tap as rxTap,
  ignoreElements,
  asyncScheduler as rxAsyncScheduler,
} from "rxjs";
import {
  mergeMap as rxOperatorMergeMap,
  switchMap as rxOperatorSwitchMap,
  observeOn as rxOperatorObserveOn,
} from "rxjs/operators";
import { getRequestConfig } from "./utils";
import { ResponseOpts } from "./provide";

export type ReqType = { body?: Record<string, any>; [key: string]: any };

/**
 * 两种模式
 * requestFromReq ：开发时候创建的
 * requestConfig： 通过配置添加
 */
export interface IRequestActor<TReq = any, TRes = any, TErr = any> {
  name: string;
  requestFromReq?: (req: TReq) => AxiosRequestConfig;
  requestConfig?: AxiosRequestConfig;
  label?: string;
  req?: TReq;
  res?: AxiosResponse<TRes>;
  err?: TErr;
  stage?: "DONE" | "FAILED" | "CANCEL";
  id?: string;
  //拓展 用于dispatchRequest
  /**
   * {
   *   // url中 参数名称 集合
   *   queryInPath:string[]
   * }
   */
  extra?: Record<string, any>;
}

export const isPreRequestActor = (actor: IRequestActor) => {
  return !actor.stage;
};

export const isCancelRequestActor = (actor: IRequestActor) => {
  return !!actor.stage && actor.stage === "CANCEL";
};

export const isFailedRequestActor = (actor: IRequestActor) => {
  return !!actor.stage && actor.stage === "FAILED";
};

export const isDoneRequestActor = (actor: IRequestActor) => {
  return !!actor.stage && actor.stage === "DONE";
};

export const createRequestActor = <TReq extends ReqType, TRes>(
  name: IRequestActor<TReq, TRes>["name"],
  requestFromReq: IRequestActor<TReq, TRes>["requestFromReq"],
  extra?: Pick<IRequestActor<TReq, TRes>, "label">,
): IRequestActor<TReq, TRes> => {
  return {
    name,
    requestFromReq,
    ...extra,
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

export const createRequestFactory = (client: AxiosInstance) => {
  const cachedRequest$: {
    [k: string]: {
      cancelTokenSource?: CancelTokenSource;
      config: AxiosRequestConfig;
      source$: Observable<AxiosResponse>;
    };
  } = {};

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

  return (actor: IRequestActor) => {
    //prepare 发起请求的 config
    const axiosRequestConfig = getRequestConfig(actor);

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

        const result = {
          cancelTokenSource,
          config: axiosRequestConfig,
          source$: rxFrom(client.request(axiosRequestConfig)),
        };

        return result.source$;
      }

      const cancelTokenSource = createSource();
      axiosRequestConfig.cancelToken = cancelTokenSource?.token;
      alterActorCancelTokenSource(actor, cancelTokenSource);

      return rxFrom(client.request(axiosRequestConfig));
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

export const createRequestObservable = (
  actor$: Observable<IRequestActor>,
  client: AxiosInstance,
  opts?: ResponseOpts,
) => {
  const requestFactory = createRequestFactory(client);

  const fakeCancelRequest = (axiosRequestConfig: AxiosRequestConfig) => {
    const source = axios.CancelToken.source();
    source.cancel();

    return rxFrom(
      client.request({
        ...axiosRequestConfig,
        cancelToken: source.token,
      }),
    );
  };

  const ob = rxMerge(
    actor$.pipe(
      rxFilter(isPreRequestActor),
      rxOperatorMergeMap((actor: IRequestActor) => {
        const request = requestFactory(actor);

        return rxMerge(
          request().pipe(
            rxOperatorSwitchMap((response) => {
              if (isCancelActor(actor)) {
                return fakeCancelRequest(request.config);
              }
              return rxOf(response);
            }),
            rxMap((response) => {
              if (opts?.convertResponse) {
                return opts.convertResponse(actor, response);
              }
              return { ...actor, stage: "DONE", res: response } as IRequestActor;
            }),
            rxCatchError((err) => {
              const errActor = opts?.convertError
                ? opts.convertError(actor, err)
                : { ...actor, stage: "FAILED", err: err };
              return rxOf(errActor as IRequestActor);
            }),
            rxTap(() => {
              request.clear();
            }),
          ),
        );
      }),
    ),
    actor$.pipe(
      rxFilter(isCancelRequestActor),
      rxMap((actor) => {
        cancelActorIfExists(actor);
      }),
      ignoreElements(),
    ),
  );

  if (!opts?.sync) {
    return ob.pipe(rxOperatorObserveOn(rxAsyncScheduler));
  }

  return ob;
};
