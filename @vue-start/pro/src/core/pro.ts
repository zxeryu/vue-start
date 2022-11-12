import { App, defineComponent, ExtractPropTypes, inject, PropType, provide } from "vue";
import { TColumns, TElementMap } from "../types";

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
  /**
   * 对 column 进行补充
   * 通常对columns为静态值时候使用
   */
  columnState: { type: Object as PropType<Record<string, any>> },
});

export type ProBaseProps = Partial<ExtractPropTypes<ReturnType<typeof proBasePropsFn>>>;

export const proBaseProps: ProBaseProps = proBasePropsFn() as any;

export interface IProConfigProvide {
  /**
   * 组件集
   */
  elementMap?: TElementMap;
  /**
   * form组件集（使用FormItem包裹的组件集合）
   */
  formElementMap?: TElementMap;
}

const proConfigProps = () => ({
  config: { type: Object as PropType<IProConfigProvide>, default: {} },
});

const ProConfigKey = Symbol("pro-config");

export const useProConfig = (): IProConfigProvide => (inject(ProConfigKey) || {}) as IProConfigProvide;

export type ProConfigProps = Partial<ExtractPropTypes<ReturnType<typeof proConfigProps>>>;

/**
 * 组件方式注册
 */
export const ProConfig = defineComponent<ProConfigProps>({
  props: {
    ...(proConfigProps() as any),
  },
  setup: (props, { slots }) => {
    provide(ProConfigKey, props.config);

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
  (config: IProConfigProvide = {}) =>
  (app: App) => {
    app.provide(ProConfigKey, config);
  };
