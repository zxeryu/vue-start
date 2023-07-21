import { defineComponent, ExtractPropTypes, inject, PropType, provide, reactive } from "vue";
import { TActionEvent, TActionState, TElementMap } from "../types";
import { get, isArray, isFunction, isObject, keys, reduce, size } from "lodash";
import { UnwrapNestedRefs } from "@vue/reactivity";
import { Subject } from "rxjs";
import { setReactiveValue, useEffect } from "@vue-start/hooks";
import { IRequestActor, useRequestProvide } from "@vue-start/request";
import { useComposeRequestActor } from "./request";
import { IElementConfig, renderElement, renderElements } from "./core";
import { useProConfig } from "./pro";

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
  requests: IRequestOpts[];
  sendRequest: (requestNameOrAction: string, ...params: any[]) => void;
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
  convertData?: (actor: IRequestActor) => Record<string, any>; //请求结果转换
  onSuccess?: (actor?: IRequestActor) => void; //请求成功回调
  onFailed?: (actor?: IRequestActor) => void; //请求失败回调
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
  requests: { type: Array as PropType<IRequestOpts[]> },
});

export type ProModuleProps = Partial<ExtractPropTypes<ReturnType<typeof proModuleProps>>>;

export const ProModule = defineComponent<ProModuleProps>({
  props: {
    ...(proModuleProps() as any),
  },
  setup: (props, { slots, expose }) => {
    const { elementMap: elementMapP } = useProConfig();

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

    /*********************************** 页面状态 ***************************************/

    const state = props.state || reactive({});

    const dispatch = (action: TActionState) => {
      const prev = state[action.type];
      const data = isFunction(action.payload) ? action.payload(prev) : action.payload;
      //如果要更新的属性值是 object ，执行覆盖操作
      if (isObject(prev)) {
        setReactiveValue(state[action.type], data);
        return;
      }
      state[action.type] = data;
    };

    /*********************************** request ***************************************/
    const { dispatchRequest } = useRequestProvide();

    const requestMap = reduce(props.requests, (pair, item) => ({ ...pair, [item.actor?.name]: item }), {});
    const actionMap = reduce(props.requests, (pair, item) => ({ ...pair, [item.action!]: item }), {});

    //发送请求
    const sendRequest = (requestNameOrAction: string, ...params: any[]) => {
      const requestOpts = get(requestMap, requestNameOrAction) || get(actionMap, requestNameOrAction);
      if (!requestOpts) {
        return;
      }
      let nextParams;
      if (requestOpts.convertParams) {
        nextParams = requestOpts.convertParams(...params);
      } else {
        nextParams = get(params, 0);
      }

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
          //如果设置了stateName，将结果维护到state中
          if (requestOpts?.stateName) {
            const data = requestOpts.convertData ? requestOpts.convertData(actor) : actor.res?.data;
            dispatch({ type: requestOpts.stateName, payload: data });
          }
          //发送成功事件
          sendEvent({ type: RequestAction.Success, payload: { actor, requestOpts } });
          //回调事件
          requestOpts.onSuccess?.(actor);
        },
        onFailed: (actor) => {
          const requestOpts = get(requestMap, actor.name);
          //发送失败事件
          sendEvent({ type: RequestAction.Fail, payload: { actor, requestOpts } });
          //回调事件
          requestOpts.onFailed?.(actor);
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

    provideProModule({
      elementMap,
      //
      subject$,
      sendEvent,
      //
      state,
      dispatch,
      //
      requests: props.requests!,
      sendRequest,
    });

    expose({
      sendEvent,
      sendRequest,
    });

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
