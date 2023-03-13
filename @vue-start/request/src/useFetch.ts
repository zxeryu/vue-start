import { IRequestActor, isDoneRequestActor, isFailedRequestActor } from "./createRequest";
import { generateId, useEffect, useState, useWatch } from "@vue-start/hooks";
import { isReactive, ref, Ref, toRaw, UnwrapNestedRefs, UnwrapRef, WatchSource } from "vue";
import { isBoolean, isFunction } from "lodash";
import { useRequestProvide } from "./provide";
import { filter as rxFilter, merge as rxMerge, tap as rxTap } from "rxjs";

export interface IUseFetchOptions<TRequestActor extends IRequestActor> {
  initEmit?: boolean;
  params?: TRequestActor["req"] | (() => TRequestActor["req"]);
  deps?: WatchSource[];
  convertData?: (response: TRequestActor["res"]) => any;
  onSuccess?: (actor: TRequestActor, data?: any) => void;
  onFail?: (actor: TRequestActor) => void;
  onFinish?: () => void;
}

export interface IUseFetchResult<TRequestActor extends IRequestActor> {
  data: UnwrapNestedRefs<TRequestActor["res"]>;
  requesting: Ref<UnwrapRef<boolean>>;
  request: (params: TRequestActor["req"]) => void;
}

export const useFetch = <TRequestActor extends IRequestActor>(
  requestActor: IRequestActor,
  options: IUseFetchOptions<TRequestActor>,
): IUseFetchResult<TRequestActor> => {
  const { requestSubject$, dispatchRequest } = useRequestProvide();

  const [data, setData] = useState<TRequestActor["res"]>();
  const requesting = ref<boolean>(isBoolean(options.initEmit) ? options.initEmit : false);

  // 当前请求对象
  let lastRequestActor: TRequestActor | undefined = undefined;

  //取消请求
  const cancelIfExists = () => {
    lastRequestActor && dispatchRequest({ ...lastRequestActor, stage: "CANCEL" });
  };

  const request = (params?: TRequestActor["req"]) => {
    let nextParams = params;
    if (!nextParams) {
      const p = isFunction(options.params) ? options.params() : options.params;
      nextParams = isReactive(p) ? { ...toRaw(p) } : p;
    }

    cancelIfExists();
    requesting.value = true;
    lastRequestActor = dispatchRequest({ ...requestActor, id: generateId() }, nextParams) as TRequestActor;
  };

  useEffect(() => {
    //初始化 请求
    if (options.initEmit) {
      request();
    }

    //判断是否是同一个 RequestActor
    const isSameRequest = (actor: IRequestActor) => {
      return lastRequestActor?.name === actor.name && lastRequestActor?.id === actor.id;
    };

    const endRequest = () => {
      lastRequestActor = undefined;
      requesting.value = false;
      options.onFinish?.();
    };

    const sub = rxMerge(
      requestSubject$.pipe(
        rxFilter(isDoneRequestActor),
        rxFilter(isSameRequest),
        rxTap((actor) => {
          const data = options.convertData ? options.convertData(actor.res?.data) : actor.res?.data;
          setData(data);
          options.onSuccess?.(actor as TRequestActor, data);
          endRequest();
        }),
      ),
      requestSubject$.pipe(
        rxFilter(isFailedRequestActor),
        rxFilter(isSameRequest),
        rxTap((actor) => {
          options.onFail?.(actor as TRequestActor);
          endRequest();
        }),
      ),
    ).subscribe();

    return () => {
      //组件卸载
      cancelIfExists();
      sub && sub.unsubscribe();
    };
  }, []);

  useWatch(() => request(), options.deps ? options.deps : []);

  return {
    data,
    requesting,
    request,
  };
};
