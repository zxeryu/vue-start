import { defineComponent, ExtractPropTypes, inject, PropType, provide, reactive } from "vue";
import { TActionEvent, TActionState, TElementMap } from "../types";
import { filter, forEach, get, isArray, isFunction, isObject, isString, keys, map, reduce, size, has } from "lodash";
import { UnwrapNestedRefs } from "@vue/reactivity";
import { Subject } from "rxjs";
import { map as rxMap, tap as rxTap } from "rxjs/operators";
import { setReactiveValue, useEffect } from "@vue-start/hooks";
import { IRequestActor, useRequestProvide } from "@vue-start/request";
import { useComposeRequestActor } from "./request";
import { IElementConfig, renderElement, renderElements, TExecuteItem } from "./core";
import { useProConfig } from "./pro";
import { useProRouter } from "./router";
import { executeEx, TExpression } from "./expression";
import { shallowEqual, useStore } from "@vue-start/store";
import { useDispatchStore } from "./store";

const ProModuleKey = Symbol("pro-module");

export interface IProModuleProvide {
  elementMap: TElementMap;
  //
  subject$: Subject<TActionEvent>;
  sendEvent: (action: TActionEvent) => void;
  //
  state: UnwrapNestedRefs<Record<string, any>>;
  dispatch: (action: TActionState) => void;
  //
  data: Record<string, any>;
  //
  requests: IRequestOpts[];
  sendRequest: (requestNameOrAction: string, ...params: any[]) => void;
  //
  executeExp: (param: TExpression, args: any) => any;
  execute: (executeList: TExecuteItem[], args: any[]) => void;
}

export const useProModule = (): IProModuleProvide => inject(ProModuleKey) as IProModuleProvide;

export const provideProModule = (ctx: IProModuleProvide) => {
  provide(ProModuleKey, ctx);
};

//订阅module事件
export const useModuleEvent = (cb: (action: TActionEvent) => void) => {
  const { subject$ } = useProModule();

  useEffect(() => {
    const sub = subject$.subscribe({
      next: (action) => {
        cb(action);
      },
    });
    return () => {
      return sub.unsubscribe();
    };
  }, []);
};

export interface IRequestOpts {
  actor: IRequestActor;
  /**
   * 如果设置action，可以使用该值发起请求 住：要保证唯一性
   * 设置该字段原因：因为actor中的name不友好，可以理解为一个备选方案
   */
  action?: string;
  stateName?: string; //如果设置，将在state中维护[stateName]数据 请求返回数据
  loadingName?: string; //如果设置，将在state中维护[loadingName]数据 请求状态 boolean类型
  convertParams?: (...params: any[]) => Record<string, any>; //请求参数转换
  convertParamsEx?: TExpression;
  convertData?: (actor: IRequestActor) => Record<string, any>; //请求结果转换
  convertDataEx?: TExpression;
  onSuccess?: (actor?: IRequestActor) => void; //请求成功回调
  onSuccessEx?: TExecuteItem[];
  onFailed?: (actor?: IRequestActor) => void; //请求失败回调
  onFailedEx?: TExecuteItem[];
}

export const RequestAction = {
  Success: "request-success$",
  Fail: "request-fail$",
};

const proModuleProps = () => ({
  /**
   * module状态
   */
  state: { type: Object as PropType<UnwrapNestedRefs<Record<string, any>>> },
  //初始化状态数据
  initState: { type: Object as PropType<object> },
  /**
   * store names
   */
  storeKeys: { type: Array as PropType<string[]> },
  /**
   * meta names
   */
  metasKeys: { type: Array as PropType<string[]> },
  /**
   * 组件集
   */
  elementMap: { type: Object as PropType<TElementMap> },
  /**
   * 组件描述（树）
   */
  elementConfigs: { type: Array as PropType<IElementConfig | IElementConfig[]> },
  /**
   * requests
   */
  actors: { type: Array as PropType<IRequestActor[]> },
  requests: { type: Array as PropType<IRequestOpts[]> },
});

export type ProModuleProps = Partial<ExtractPropTypes<ReturnType<typeof proModuleProps>>>;

export const ProModule = defineComponent<ProModuleProps>({
  props: {
    ...(proModuleProps() as any),
  },
  setup: (props, { slots, expose }) => {
    const store$ = useStore();
    const { router } = useProRouter();
    const { elementMap: elementMapP, registerStoreMap, expressionMethods } = useProConfig();

    const elementMap = props.elementMap! || elementMapP;

    /*********************************** render ***************************************/

    const render = (elementConfig: IElementConfig | IElementConfig[]) => {
      if (isArray(elementConfig)) {
        return renderElements(elementMap, elementConfig);
      }
      return renderElement(elementMap, elementConfig);
    };

    /*********************************** 事件处理 ***************************************/
    const subject$ = new Subject<TActionEvent>();
    //发送Module事件
    const sendEvent = (action: TActionEvent) => {
      subject$.next(action);
    };

    /*********************************** state、store ***************************************/
    //初始化获取store中的值赋值到state中
    const storeKeys = filter(props.storeKeys, (item) => has(registerStoreMap, item));
    const createStoreValue = () => {
      return reduce(
        storeKeys,
        (pair, item) => {
          const storeItem = get(registerStoreMap, item);
          return {
            ...pair,
            [item]:
              get(store$.value, `${storeItem.persist ? "$" : ""}${item}`) ||
              get(registerStoreMap, [item, "initialState"]),
          };
        },
        {},
      );
    };
    const initStoreValue = createStoreValue();

    const state = props.state || reactive({ ...initStoreValue, ...props.initState });

    const data = {};

    //更新state值
    const dispatch = (action: TActionState) => {
      const prev = state[action.type];
      const data = isFunction(action.payload) ? action.payload(prev) : action.payload;
      //如果要更新的属性值是 object，非 arr ，执行覆盖操作
      if (!isArray(prev) && isObject(prev)) {
        setReactiveValue(state[action.type], data);
        return;
      }
      state[action.type] = data;
    };

    //更新全局状态
    const dispatchStore = useDispatchStore();

    const stateExObj = { dispatch, dispatchStore };

    //订阅的store 赋值到state中
    useEffect(() => {
      const sub = store$
        .pipe(
          rxMap(() => createStoreValue()),
          rxTap((sv) => {
            forEach(sv, (v, k) => {
              const currentV = get(state, k);
              //当前值和响应值不一样的话，更新state
              if (!shallowEqual(currentV, v)) {
                dispatch({ type: k, payload: v });
              }
            });
          }),
        )
        .subscribe();
      return () => {
        sub.unsubscribe();
      };
    }, []);

    /*********************************** request ***************************************/
    const { dispatchRequest } = useRequestProvide();

    //request actors 兼容
    const initRequestMap = () => {
      const obj: Record<string, IRequestOpts> = {};
      //注册的actors
      const actorMap = reduce(props.actors || [], (pair, actor) => ({ ...pair, [actor.name]: actor }), {});
      //注册的requests
      forEach(props.requests, (item) => {
        if (isString(item.actor)) {
          const actor = get(actorMap, item.actor);
          if (!actor) return;
          item.actor = actor;
        }
        if (!item.actor) return;
        obj[item.actor.name] = item;
        if (item.action) {
          obj[item.action] = item;
        }
      });
      return obj;
    };
    const requestMap = initRequestMap();

    const convertParams = (requestOpts: IRequestOpts, ...params: any[]): any => {
      if (requestOpts.convertParams) {
        return requestOpts.convertParams(...params);
      } else if (requestOpts.convertParamsEx) {
        return executeExp(requestOpts.convertParamsEx, params);
      }
      return get(params, 0);
    };

    const convertData = (requestOpts: IRequestOpts, actor: IRequestActor) => {
      if (requestOpts.convertData) {
        return requestOpts.convertData(actor);
      } else if (requestOpts.convertDataEx) {
        return executeExp(requestOpts.convertDataEx, actor);
      }
      return actor.res?.data;
    };

    //发送请求
    const sendRequest = (requestNameOrAction: string, ...params: any[]) => {
      const requestOpts = get(requestMap, requestNameOrAction);
      if (!requestOpts) {
        return;
      }
      const nextParams = convertParams(requestOpts, ...params);

      //如果设置了loading，将请求状态维护到state中
      if (requestOpts.loadingName) {
        dispatch({ type: requestOpts.loadingName, payload: true });
      }
      dispatchRequest(requestOpts.actor, nextParams);
    };

    useComposeRequestActor(
      keys(requestMap),
      {
        onSuccess: (actor) => {
          const requestOpts = get(requestMap, actor.name);
          const data = convertData(requestOpts, actor);
          //如果设置了stateName，将结果维护到state中
          if (requestOpts?.stateName) {
            dispatch({ type: requestOpts.stateName, payload: data });
          }
          //发送成功事件
          sendEvent({ type: RequestAction.Success, payload: { actor, requestOpts } });
          //回调事件
          requestOpts.onSuccess?.(actor);
          requestOpts.onSuccessEx && execute(requestOpts.onSuccessEx, [data]);
        },
        onFailed: (actor) => {
          const requestOpts = get(requestMap, actor.name);
          //发送失败事件
          sendEvent({ type: RequestAction.Fail, payload: { actor, requestOpts } });
          //回调事件
          requestOpts.onFailed?.(actor);
          requestOpts.onFailedEx && execute(requestOpts.onFailedEx, [actor.err]);
        },
        onFinish: (actor) => {
          const loadingName = get(requestMap, [actor.name, "loadingName"]);
          if (loadingName) {
            dispatch({ type: loadingName, payload: false });
          }
        },
      },
      true,
    );

    /*********************************** expression ***************************************/

    const executeExp = (param: TExpression, args: any) => {
      return executeEx(param, { state, data, args, expressionMethods });
    };

    const execute = (executeList: TExecuteItem[], args: any[]) => {
      if (!executeList) return;

      const options: any = { state, data, args, expressionMethods };

      forEach(executeList, (item) => {
        if (!isArray(item) || size(item) < 2) {
          console.log("execute invalid", item);
          return;
        }
        const [name, funName, ...params] = item;
        let fun;
        switch (name) {
          case "router":
            fun = get(router, funName);
            break;
          case "state":
            fun = get(stateExObj, funName);
            break;
        }
        if (fun) {
          try {
            const paramValues = map(params, (param) => executeEx(param, options));
            fun(...paramValues);
          } catch (e) {
            console.log("execute err", e);
          }
        }
      });
    };

    provideProModule({
      elementMap,
      //
      subject$,
      sendEvent,
      //
      state,
      dispatch,
      //
      data,
      //
      requests: props.requests!,
      sendRequest,
      //
      executeExp,
      execute,
    });

    expose({ sendEvent, sendRequest });

    return () => {
      return (
        <>
          {size(props.elementConfigs) > 0 && render(props.elementConfigs!)}
          {slots.default?.()}
        </>
      );
    };
  },
});
