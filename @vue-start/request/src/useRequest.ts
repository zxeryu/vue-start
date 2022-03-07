import { onBeforeUnmount, isReactive, isRef, toRaw } from "vue";
import { IRequestActor, isDoneRequestActor, isFailedRequestActor } from "./createRequest";
import { generateId } from "./utils";
import { merge as rxMerge, filter as rxFilter, tap as rxTap, BehaviorSubject } from "rxjs";
import { get, isFunction } from "lodash";
import { useRequestProvide } from "./provide";
import { useEffect, useState } from "@vue-start/hooks";

export interface IUseRequestOptions<TReq, TRes, TErr> {
  defaultLoading?: boolean;
  onSuccess?: (actor: IRequestActor<TReq, TRes, TErr>) => void;
  onFail?: (actor: IRequestActor<TReq, TRes, TErr>) => void;
  onFinish?: () => void;
}

export const useRequest = <TReq, TRes, TErr>(
  requestActor: IRequestActor<TReq, TRes, TErr>,
  options?: IUseRequestOptions<TReq, TRes, TErr>,
): readonly [
  (
    params: IRequestActor<TReq, TRes, TErr>["req"],
    options?: Pick<IUseRequestOptions<TReq, TRes, TErr>, "onSuccess" | "onFail">,
  ) => void,
  BehaviorSubject<boolean>,
] => {
  const { requestSubject$, dispatchRequest } = useRequestProvide();

  const requesting$ = new BehaviorSubject<boolean>(!!get(options, "defaultLoading"));

  let lastRequestActor: IRequestActor<TReq, TRes, TErr> | undefined = undefined;
  const lastCallback: Pick<IUseRequestOptions<TReq, TRes, TErr>, "onSuccess" | "onFail"> = {};

  const cancelIfExists = () => {
    lastRequestActor && dispatchRequest({ ...lastRequestActor, stage: "CANCEL" });
  };

  const end = () => {
    lastRequestActor = undefined;
    requesting$.next(false);
    options?.onFinish && options.onFinish();
  };

  const isSameRequest = (actor: IRequestActor) => {
    return lastRequestActor?.name === actor.name && lastRequestActor?.id === actor.id;
  };

  const sub = rxMerge(
    requestSubject$.pipe(
      rxFilter(isDoneRequestActor),
      rxFilter(isSameRequest),
      rxTap((actor) => {
        lastCallback.onSuccess && lastCallback.onSuccess(actor);
        options?.onSuccess && options.onSuccess(actor);
        end();
      }),
    ),
    requestSubject$.pipe(
      rxFilter(isFailedRequestActor),
      rxFilter(isSameRequest),
      rxTap((actor) => {
        lastCallback.onFail && lastCallback.onFail(actor);
        options?.onFail && options.onFail(actor);
        end();
      }),
    ),
  ).subscribe();

  onBeforeUnmount(() => {
    cancelIfExists();
    sub && sub.unsubscribe();
  });

  const request = (
    params: IRequestActor<TReq, TRes, TErr>["req"],
    options?: Pick<IUseRequestOptions<TReq, TRes, TErr>, "onSuccess" | "onFail">,
  ) => {
    cancelIfExists();

    lastCallback.onSuccess = options?.onSuccess;
    lastCallback.onFail = options?.onFail;

    requesting$.next(true);

    const id = generateId();
    const actor = { ...requestActor, id };

    lastRequestActor = actor;

    dispatchRequest(actor, params);
  };

  return [request, requesting$];
};

/**
 * 直接发起请求
 */
export const useDirectRequest = <TRequestActor extends IRequestActor>(
  requestActor: TRequestActor,
  params: TRequestActor["req"] | (() => TRequestActor["req"]),
  deps: any | any[],
) => {
  const [state, setState] = useState<TRequestActor["res"]>();

  const [request, requesting$] = useRequest(requestActor, {
    onSuccess: (actor) => {
      setState(actor.res?.data);
    },
  });

  const req = (nextParams?: TRequestActor["req"]) => {
    if (nextParams) {
      request(nextParams);
      return;
    }
    let p = isFunction(params) ? params() : params;
    if (isReactive(params)) {
      p = toRaw(p);
    } else if (isRef(params)) {
      p = params.value;
    }
    request(p);
  };

  useEffect(() => {
    req();
  }, deps);

  return [state, req, requesting$];
};
