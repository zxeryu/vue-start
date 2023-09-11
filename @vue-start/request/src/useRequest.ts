import { isReactive, isRef, ref, toRaw } from "vue";
import { IRequestActor, isDoneRequestActor, isFailedRequestActor } from "./createRequest";
import { merge as rxMerge, filter as rxFilter, tap as rxTap, BehaviorSubject, Observable } from "rxjs";
import { get, isFunction } from "lodash";
import { useRequestProvide } from "./provide";
import { generateId, useEffect, useState } from "@vue-start/hooks";
import { Ref } from "@vue/reactivity";

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

  const id = generateId();

  const requesting$ = new BehaviorSubject<boolean>(!!get(options, "defaultLoading"));

  let lastRequestActor: IRequestActor<TReq, TRes, TErr> | undefined = undefined;
  const lastCallback: Pick<IUseRequestOptions<TReq, TRes, TErr>, "onSuccess" | "onFail"> = {};

  const cancelIfExists = () => {
    lastRequestActor && dispatchRequest({ ...lastRequestActor, stage: "CANCEL" });
  };

  useEffect(() => {
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

    return () => {
      cancelIfExists();
      sub && sub.unsubscribe();
    };
  }, []);

  const request = (
    params: IRequestActor<TReq, TRes, TErr>["req"],
    options?: Pick<IUseRequestOptions<TReq, TRes, TErr>, "onSuccess" | "onFail">,
  ) => {
    cancelIfExists();

    lastCallback.onSuccess = options?.onSuccess;
    lastCallback.onFail = options?.onFail;

    requesting$.next(true);

    lastRequestActor = dispatchRequest({ ...requestActor, id: requestActor.id || id }, params);
  };

  return [request, requesting$];
};

export const useObservableRef = <T>(ob$: Observable<T>, defaultValue?: T): Ref<T | undefined> => {
  const valueRef = ref(defaultValue || (ob$ as any).value);

  useEffect(() => {
    const sub = ob$.subscribe((val: T) => {
      valueRef.value = val;
    });
    return () => {
      sub && sub.unsubscribe();
    };
  }, []);

  return valueRef;
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
