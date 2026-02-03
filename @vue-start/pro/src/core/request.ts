import { IRequestActor, isDoneRequestActor, isFailedRequestActor, useRequestProvide } from "@vue-start/request";
import { useEffect } from "@vue-start/hooks";
import { merge as rxMerge, filter as rxFilter, tap as rxTap } from "rxjs";
import { forEach, get, isFunction, isString, map, reduce } from "lodash";
import { IProConfigProvide, useProConfig } from "./pro";
import { useDispatchStore, useObservableRef, useStoreConn } from "@vue-start/store";
import { Ref } from "@vue/reactivity";
import { computed, ComputedRef, UnwrapNestedRefs } from "vue";

/******************************* subscribe *********************************/

const createUseRequestActor =
  (filterFun: (actor: IRequestActor) => boolean) =>
  (actors: (IRequestActor | string)[], callback: (actor: IRequestActor) => void) => {
    const { requestSubject$ } = useRequestProvide();

    const nameSet = new Set(map(actors, (actor) => (isString(actor) ? actor : actor.name)));

    useEffect(() => {
      const sub = requestSubject$
        .pipe(
          rxFilter(filterFun),
          rxTap((actor) => {
            if (nameSet.has(actor.name)) {
              callback(actor);
            }
          }),
        )
        .subscribe();
      return () => {
        sub.unsubscribe();
      };
    }, []);
  };

export const useDoneRequestActor = createUseRequestActor(isDoneRequestActor);
export const useFailedRequestActor = createUseRequestActor(isFailedRequestActor);

export const useComposeRequestActor = (
  //接口 或 接口名称 集合
  actors: (IRequestActor | string)[],
  //各种状态回调
  options: {
    onSuccess?: (actor: IRequestActor) => void;
    onFailed?: (actor: IRequestActor) => void;
    onFinish?: (actor: IRequestActor) => void;
  },
  //是否cancel，当组件卸载的时候
  cancelWhileUnmount?: boolean,
) => {
  const { requestSubject$, dispatchRequest } = useRequestProvide();

  const nameSet = new Set(map(actors, (actor) => (isString(actor) ? actor : actor.name)));

  const lastRequestActors: { [key: string]: IRequestActor | undefined } = {};

  useEffect(() => {
    const sub = rxMerge(
      requestSubject$.pipe(
        rxFilter(isDoneRequestActor),
        rxTap((actor) => {
          if (nameSet.has(actor.name)) {
            options.onSuccess?.(actor);
            options.onFinish?.(actor);

            lastRequestActors[actor.name] = undefined;
          }
        }),
      ),
      requestSubject$.pipe(
        rxFilter(isFailedRequestActor),
        rxTap((actor) => {
          if (nameSet.has(actor.name)) {
            options.onFailed?.(actor);
            options.onFinish?.(actor);

            lastRequestActors[actor.name] = undefined;
          }
        }),
      ),
    ).subscribe();
    return () => {
      sub.unsubscribe();
      if (cancelWhileUnmount) {
        //组件销毁的时候cancel请求
        forEach(lastRequestActors, (actor) => {
          actor && dispatchRequest({ ...actor, stage: "CANCEL" });
        });
      }
    };
  }, []);
};

/******************************* meta *********************************/

/**
 * 转换请求数据
 * @param actor
 * @param convertData
 * @param convertPath
 */
export const convertResData = (
  actor: IRequestActor,
  convertData?: (res: IRequestActor["res"], actor: IRequestActor) => any,
  convertPath?: (string | number)[],
): any => {
  const data = actor.res?.data;
  if (convertData) {
    return convertData(data, actor);
  }
  if (convertPath) {
    return get(data, convertPath);
  }
  return data;
};

export type TMeta = {
  actorName: string;
  //全局状态中的 key 缺省为 `${actorName}`
  storeName: string | ((params?: Record<string, any>) => string);
  //默认参数
  initParams?: Record<string, any>;
  //转换path  IRequestActor["res"] 中找到convertPath对应的值
  convertPath?: (string | number)[];
  //转换方法
  convertData?: (data: any, actor: IRequestActor) => any;
};

const getStoreName = (actorName: string, storeName: TMeta["storeName"], params?: Record<string, any>): string => {
  if (isFunction(storeName)) {
    return actorName + "_" + storeName(params);
  }
  return storeName || actorName;
};

export const useGetMetaStoreName = () => {
  const { registerMetaMap } = useProConfig();

  return (actorName: string, params?: Record<string, any>) => {
    const registerMetaItem = get(registerMetaMap, actorName);
    if (!registerMetaItem) return undefined;
    return getStoreName(actorName, registerMetaItem.storeName, params);
  };
};

/**
 * 读取meta加载状态
 */
export const useMetaLoading = (actorName: string, params?: Record<string, any>): ComputedRef<boolean> => {
  const { registerMetaMap, metaState } = useProConfig();
  const registerMetaItem = get(registerMetaMap, actorName);
  if (!registerMetaItem) return {} as any;

  const storeNname = getStoreName(actorName, registerMetaItem.storeName, params || registerMetaItem.initParams);

  return computed(() => metaState[storeNname]);
};

/**
 * 读取meta状态
 * @param actorName
 * @param params
 */
export const useMeta = <T>(actorName: string, params?: Record<string, any>): Ref<T | undefined> => {
  const { registerMetaMap, dispatchRequest, metaState } = useProConfig();
  const registerMetaItem = get(registerMetaMap, actorName);
  if (!registerMetaItem) return {} as any;

  const name = getStoreName(actorName, registerMetaItem.storeName, params || registerMetaItem.initParams);
  const mapper = (state: Record<string, any>) => {
    return get(state, name);
  };

  const valueRef = useObservableRef<T>(useStoreConn(mapper));
  if (!valueRef.value && !metaState[name]) {
    //发送meta请求
    dispatchRequest(actorName, params || registerMetaItem.initParams || {});
    metaState[name] = true;
  }
  return valueRef;
};

export type TMetaKey = { actorName: string; params?: Record<string, any> };

export const useRegisterMetas = (metaKeys: TMetaKey[]) => {
  const getMetaStoreName = useGetMetaStoreName();

  return reduce(
    metaKeys,
    (pair, item) => {
      const storeName = getMetaStoreName(item.actorName, item.params);
      if (!storeName) return pair;
      return { ...pair, [storeName]: useMeta(item.actorName, item.params) };
    },
    {},
  );
};

//订阅meta接口
export const useMetaRegister = (
  registerMetaMap: IProConfigProvide["registerMetaMap"],
  registerActorMap: IProConfigProvide["registerActorMap"],
  metaState: UnwrapNestedRefs<{ [key: string]: boolean }>,
) => {
  const { requestSubject$ } = useRequestProvide();
  const dispatchStore = useDispatchStore();

  const metaFilter = (actor: IRequestActor): boolean => {
    const registerMetaItem = get(registerMetaMap, actor.name);
    const registerActorItem = get(registerActorMap, actor.name);
    if (registerMetaItem && registerActorItem && registerActorItem.actor) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const sub = rxMerge(
      requestSubject$.pipe(
        rxFilter(metaFilter),
        rxFilter(isDoneRequestActor),
        rxTap((actor) => {
          const registerMetaItem = get(registerMetaMap, actor.name);
          if (!registerMetaItem) return;

          const data = convertResData(actor, registerMetaItem.convertData, registerMetaItem.convertPath);
          //将请求回来的数据同步到store$中
          const storeName = getStoreName(actor.name, registerMetaItem.storeName, actor.req);
          dispatchStore(storeName, data, false, undefined);
          //
          metaState[storeName] = false;
        }),
      ),
      requestSubject$.pipe(
        rxFilter(metaFilter),
        rxFilter(isFailedRequestActor),
        rxTap((actor) => {
          const registerMetaItem = get(registerMetaMap, actor.name);
          if (!registerMetaItem) return;

          const storeName = getStoreName(actor.name, registerMetaItem.storeName, actor.req);
          metaState[storeName] = false;
        }),
      ),
    ).subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, []);
};
