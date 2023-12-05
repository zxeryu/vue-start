import { App, defineComponent, ExtractPropTypes, inject, PropType, provide } from "vue";
import { TColumn, TColumns, TElementMap } from "../types";
import { TRegisterStore, TRegisterStoreMap } from "./store";
import { get, reduce } from "lodash";
import { IRequestActor, useRequestProvide } from "@vue-start/request";
import { TMeta, useMetaRegister } from "./request";
import { TRouter } from "./router";
import { Router } from "vue-router";

const proBasePropsFn = () => ({
  /**
   * 组件集
   */
  elementMap: { type: Object as PropType<TElementMap> },
  /**
   * form组件集（使用FormItem包裹的组件集合）
   * readonly模式下使用elementMap中的组件渲染
   */
  formElementMap: { type: Object as PropType<TElementMap> },
  /**
   * 基础项配置
   */
  columns: { type: Array as PropType<TColumns> },
  convertColumn: { type: Function as PropType<(t: TColumn) => TColumn> }, //拓展使用
  /**
   * 对 column 进行补充
   * 通常对columns为静态值时候使用
   */
  columnState: { type: Object as PropType<Record<string, any>> },
});

export type ProBaseProps = Partial<ExtractPropTypes<ReturnType<typeof proBasePropsFn>>>;

export const proBaseProps: ProBaseProps = proBasePropsFn() as any;

export type ProDispatchRequestType = (
  actorName: string,
  params?: IRequestActor["req"],
  extra?: IRequestActor["extra"],
) => IRequestActor | undefined;

export type TFormExtraMap = {
  rulePrefixMap?: Record<string, string>;
};

export interface IProConfigProvide {
  /**
   * 组件集
   */
  elementMap?: TElementMap;
  /**
   * form组件集（使用FormItem包裹的组件集合）
   */
  formElementMap?: TElementMap;
  // requirePrefixMap form item required 前缀字符串，如：请输入、请选择 等
  formExtraMap?: TFormExtraMap;
  /**
   * 注册的全局状态
   */
  registerStoreMap: TRegisterStoreMap;
  /**
   * 注册的全局接口
   */
  registerActorMap: Record<string, { actor: IRequestActor }>;
  /**
   * 注册的全局Meta
   */
  registerMetaMap: Record<string, TMeta>;
  /**
   * 发送请求
   * @param actorName
   * @param params
   * @param extra
   */
  dispatchRequest: ProDispatchRequestType;
  //重写router对象
  convertRouter?: (router: Router) => TRouter;
  //表达式工具集
  expressionMethods: { [key: string]: (...params: any[]) => any };
  //message
  showMsg: (opts: Record<string, any>) => any;
  //modal
  showModal: (opts: Record<string, any>) => any;
  //notify
  showNotify: (opts: Record<string, any>) => any;
}

const proConfigProps = () => ({
  elementMap: { type: Object as PropType<TElementMap> },
  formElementMap: { type: Object as PropType<TElementMap> },
  formExtraMap: { type: Object as PropType<TFormExtraMap> },
  //全局状态
  registerStores: { type: Array as PropType<TRegisterStore[]> },
  //全局接口 （设计成对象为了拓展）
  registerActors: { type: Array as PropType<{ actor: IRequestActor }[]> },
  //全局Meta (状态+接口的组合，即：接口请求回来的值放到状态中，理论上只请求一次)
  registerMetas: { type: Array as PropType<TMeta[]> },
  //路由方法
  convertRouter: { type: Function as PropType<(router: Router) => TRouter> },
  //表达式工具集
  expressionMethods: { type: Object as PropType<{ [key: string]: (...params: any[]) => any }> },
  //message toast
  showMsg: { type: Object },
  //modal message-box
  showModal: { type: Object },
  //notify
  showNotify: { type: Object },
});

const ProConfigKey = Symbol("pro-config");

export const useProConfig = (): IProConfigProvide => (inject(ProConfigKey) || {}) as IProConfigProvide;

export const useProMsg = () => {
  const { showMsg } = useProConfig();
  return (opts: Record<string, any>) => showMsg(opts);
};

export const useProModal = () => {
  const { showModal } = useProConfig();
  return (opts: Record<string, any>) => showModal(opts);
};

export const useProNotify = () => {
  const { showNotify } = useProConfig();
  return (opts: Record<string, any>) => showNotify(opts);
};

export type ProConfigProps = Partial<ExtractPropTypes<ReturnType<typeof proConfigProps>>>;

/**
 * 组件方式注册
 */
export const ProConfig = defineComponent<ProConfigProps>({
  props: {
    ...(proConfigProps() as any),
  },
  setup: (props, { slots }) => {
    //全局注册状态 Map
    const registerStoreMap = reduce(props.registerStores, (pair, item) => ({ ...pair, [item.key]: item }), {});

    //全局注册接口 Map
    const registerActorMap = reduce(props.registerActors, (pair, item) => ({ ...pair, [item.actor.name]: item }), {});

    //全局注册meta Map
    const registerMetaMap = reduce(props.registerMetas, (pair, item) => ({ ...pair, [item.actorName]: item }), {});

    useMetaRegister(registerMetaMap, registerActorMap);

    const { dispatchRequest: dispatchRequestOrigin } = useRequestProvide();

    //发送接口
    const dispatchRequest: ProDispatchRequestType = (actorName, params, extra) => {
      const registerItem = get(registerActorMap, actorName);
      if (!registerItem) {
        return;
      }
      return dispatchRequestOrigin(registerItem.actor, params, extra);
    };

    provide(ProConfigKey, {
      elementMap: props.elementMap,
      formElementMap: props.formElementMap,
      formExtraMap: props.formExtraMap,
      //
      registerStoreMap,
      //
      registerActorMap,
      //
      registerMetaMap,
      //
      dispatchRequest,
      //
      convertRouter: props.convertRouter,
      //
      showMsg: props.showMsg,
      showModal: props.showModal,
      showNotify: props.showNotify,
    });

    return () => {
      return slots.default?.();
    };
  },
});

/**
 * app.use 方式注册
 * @param config
 */
export const createProConfig =
  (config: ProConfigProps = {}) =>
  (app: App) => {
    app.provide(ProConfigKey, config);
  };
