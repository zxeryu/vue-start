import { TColumn, TElementMap, TValueType } from "../types";
import { computed, defineComponent, h, VNode, isVNode } from "vue";
import {
  filter,
  forEach,
  get,
  head,
  isArray,
  isFunction,
  isNumber,
  isString,
  keys,
  map,
  omit,
  pick,
  reduce,
  set,
  size,
  some,
} from "lodash";
import { useProModule } from "./Module";
import { Slots } from "@vue/runtime-core";
import { TFunItem, TObjItem, TParamItem } from "./expression";
import { isPathHasParent, isValidPath, restorePath } from "@vue-start/hooks";
import { css } from "@emotion/css";

/**
 *  渲染后的插槽是否是有效的vnode
 */
export const isValidNode = (vns?: VNode[]) => {
  if (!vns) {
    return false;
  }
  //注释节点，vue3中使用注释组件标记逻辑组件返回null/undefined的情况
  if (vns?.[0]?.type?.toString() === "Symbol(Comment)") {
    return false;
  }
  return true;
};

/**
 * 获取Column的valueType，默认"text"
 * @param column
 */
export const getColumnValueType = (column: TColumn): TValueType => {
  return column.formValueType || column.valueType || "text";
};

/**
 *获取Column的FormItem name
 * @param column
 */
export const getColumnFormItemName = (column: TColumn): string | number | undefined => {
  //兼容：原始版name
  const origin = column.formItemProps?.name;
  //
  const name = column.inputProps?.name;
  return name || origin || column.dataIndex;
};

/**
 * 获取Column的FormItem props
 * @param column
 */
export const getColumnFormInputProps = (column: TColumn) => {
  return column.inputProps || column.formFieldProps || {};
};

/**
 * 获取column 中对应的render方法
 * case1：render为方法的时候，直接返回render；
 * case2：render为字符串的时候，返回column中该字符串对应的属性；
 *      如：render为"customRender"时候，返回customRender方法；
 * @param column
 * @param render
 */
export const getRealRender = (column: TColumn, render?: string | Function): Function | undefined => {
  let r: any = render;
  if (isString(render)) {
    r = get(column, render);
  }
  if (!isFunction(r)) {
    r = get(column, "render");
  }
  return isFunction(r) ? r : undefined;
};

/**
 * 渲染column描述的组件
 * @param elementMap
 * @param column
 * @param extra 动态props，一般传递value
 * @param opts
 */
export const renderColumn = (
  elementMap: any,
  column: TColumn,
  extra?: Record<string, any>,
  opts?: {
    render?: string; //默认使用render函数名称
  },
) => {
  //如果配置了render方法，优先执行
  const render = getRealRender(column, opts?.render);
  if (render) {
    return render({ ...extra, column });
  }

  const valueType = column.valueType || "text";
  const Comp: any = get(elementMap, valueType);
  if (!Comp) {
    return null;
  }

  //兼容：formFieldProps
  const slots = column.props?.slots || column.formFieldProps?.slots || {};

  const extraProps: Record<string, any> = extra || {};
  //兼容：showProps
  if (Comp.props.showProps) {
    extraProps.showProps = column.props ? column.props?.showProps : column.showProps;
  }

  const props = column.props
    ? { ...omit(column.props, "slots"), ...extraProps }
    : { ...omit(column.formFieldProps, "slots"), ...extraProps };

  return h(Comp, { ...props }, slots);
};

/**
 * form 中渲染column对应的输入组件
 * @param elementMap
 * @param formElementMap
 * @param column
 */
export const renderInputColumn = (elementMap: any, formElementMap: any, column: TColumn) => {
  const valueType = getColumnValueType(column);
  const Comp: any = get(formElementMap, valueType);
  if (!Comp) {
    return null;
  }
  const inputProps = column.inputProps;
  //兼容：formFieldProps
  const slots = inputProps?.fieldProps?.slots || column.formFieldProps?.slots || {};
  //输入组件
  if (!slots.renderInput && isFunction(column.inputRender)) {
    slots.renderInput = (opts: any) => column.inputRender!({ ...opts, column });
  }
  //展示组件
  if (!slots.renderShow) {
    slots.renderShow = (opts: any) => {
      return renderColumn(elementMap, column, { value: opts.value }, { render: "formReadRender" }) || opts.value;
    };
  }

  const name = getColumnFormItemName(column);
  const label = column.title;

  //兼容：showProps、formItemProps、formFieldProps
  const props = inputProps
    ? { ...inputProps, fieldProps: omit(inputProps.fieldProps, "slots") }
    : { ...column.formItemProps, fieldProps: omit(column.formFieldProps, "slots"), showProps: column.showProps };

  return h(Comp, { key: name, name, label, ...props }, slots);
};

/***************************************** 通用模式 *****************************************/

export declare type InternalNamePath = (string | number)[];
export declare type NamePath = string | number | InternalNamePath;

export type TExecuteName = "store" | "router" | "request"; //模块名称
export type TExecuteFunName = string; //调用模块的方法名称
export type TExecuteItem = (TExecuteName | TExecuteFunName | TParamItem | TObjItem | TFunItem)[];

export interface IHighConfig {
  //注册接受Module的状态
  registerStateList?: {
    //state中的key值
    name: NamePath;
    //组件需要的属性名称；如不存在，用name的值作为属性名称传递给组件
    mapName?: NamePath;
    //默认绑定到props中，缺省为props
    //当值为 slot 时，mapName必须存在，且为非path字符串
    target?: "prop" | "slot";
  }[];
  //注册事件
  registerEventList?: {
    //事件名称
    name: string;
    executeList?: TExecuteItem[];
  }[];
  //注册转换的props中需要转换的组件
  registerPropsTrans?: {
    name: NamePath;
    //是否转换成 ()=>VNode，如果name是arr，则无用
    isFun?: boolean;
    //isFun 为true时生效，是否需要把函数的中参数往组件传递
    needParams?: boolean;
  }[];
}

/**
 * 组件树描述
 */
export interface IElementConfig {
  elementType: string;
  elementId: string;
  elementProps?: Record<string, any>;
  slots?: {
    [name: string]:
      | string
      | number
      | ((...params$: any[]) => any)
      | (IElementConfig & {
          //是否需要slot 方法中的参数
          needParams?: boolean;
        });
  }; //插槽
  children?: IElementConfig[];
  childrenSlotName?: string; //children绑定的插槽，默认default
  highConfig$?: IHighConfig;
}

export const isValidConfig = (elementConfig: any): boolean => {
  return elementConfig && !isFunction(elementConfig) && elementConfig.elementType;
};

export const renderElements = (elementMap: TElementMap, elementConfigs: IElementConfig[]): (VNode | null)[] => {
  return map(elementConfigs, (elementConfig) => {
    return renderElement(elementMap, elementConfig);
  });
};

/**
 * 1、转换 class
 * 2、转换 props 中注册的组件
 */
const convertPropsEl = (elementMap: TElementMap, elementConfig: IElementConfig): IElementConfig["elementProps"] => {
  const elementProps = elementConfig.elementProps;
  const nextProps = { ...elementConfig.elementProps };
  //转换class
  const cls = elementProps?.class;
  if (cls) {
    if (typeof cls === "object") {
      nextProps.class = css(cls);
    } else if (isString(cls) && cls.indexOf(":") > 0) {
      nextProps.class = css`
        ${cls}
      `;
    }
  }
  //转换组件
  forEach(elementConfig.highConfig$?.registerPropsTrans, (item) => {
    const target = get(elementProps, item.name);
    if (!target || isVNode(target)) {
      return;
    }
    if (isArray(target)) {
      //如果list中存在VNode，不转换
      if (some(target, (sub) => isVNode(sub))) {
        return;
      }
      //如果碰到特殊场景，可以替换成单个渲染模式
      set(nextProps, item.name, renderElements(elementMap, target));
      return;
    }
    if (!target.elementType) {
      return;
    }
    if (item.isFun) {
      set(nextProps, item.name, (...params$: any[]) => {
        const ep = item.needParams ? { ...target.elementProps, params$ } : target.elementProps;
        return renderElement(elementMap, { ...target, elementProps: ep });
      });
    } else {
      set(nextProps, item.name, renderElement(elementMap, target));
    }
  });
  return nextProps;
};

/**
 * 转换 slots 中注册的组件 或者 字符串/数字
 */
const convertSlots = (elementMap: TElementMap, elementConfig: IElementConfig): Slots => {
  const children = size(elementConfig.children) > 0 ? renderElements(elementMap, elementConfig.children!) : undefined;
  //children插槽名称
  const childrenSlotName = elementConfig.childrenSlotName || "default";
  const validSlots = omit(elementConfig.slots, children ? childrenSlotName : "");
  //如果slots注册的是 IElementConfig ，进行转换
  forEach(keys(validSlots), (k) => {
    const v = validSlots[k as any] as any;
    //IElementConfig
    if (isValidConfig(v)) {
      validSlots[k as any] = (...params$) => {
        //如果需要params，在props中注入 params$
        const elementProps = v.needParams ? { ...v.elementProps, params$ } : v.elementProps;
        return renderElement(elementMap, { ...v, elementProps });
      };
    } else if (isString(v) || isNumber(v)) {
      validSlots[k as any] = () => v;
    }
  });
  return {
    [childrenSlotName]: children ? () => children : undefined,
    ...validSlots,
  };
};

/**
 *
 * @param elementMap
 * @param elementConfig
 */
export const renderElement = (elementMap: TElementMap, elementConfig: IElementConfig) => {
  const El = get(elementMap, elementConfig.elementType) || elementConfig.elementType;

  //如果有highConfig$，包裹一层Wrapper
  if (elementConfig.highConfig$) {
    return h(Wrapper, { key: elementConfig.elementId, elementMap, elementConfig });
  }

  const slots = convertSlots(elementMap, elementConfig);
  const elementProps = convertPropsEl(elementMap, elementConfig);
  return h(El, { key: elementConfig.elementId, ...elementProps }, slots);
};

/**
 * 获取第一层级属性名
 * 如：['aaa','bbb',...] 中的 'aaa'
 * 如："aaa.bbb.ccc..." 中的 'aaa'
 */
export const getFirstPropName = (name: NamePath) => {
  if (isArray(name)) {
    return head(name);
  } else if (isString(name) && name.indexOf(".") > 0) {
    return name.substring(0, name.indexOf("."));
  }
  return name;
};

/**
 * 处理highConfig$
 */
export const Wrapper = defineComponent<{
  elementMap: TElementMap;
  elementConfig: IElementConfig;
}>({
  props: {
    elementMap: { type: Object },
    elementConfig: { type: Object },
  } as any,
  setup: (props) => {
    const { state, sendEvent, execute } = useProModule();
    const { elementMap, elementConfig } = props;

    /************************************** highConfig ********************************************/
    const highConfig$ = elementConfig.highConfig$!;
    //转换props
    const elementProps = convertPropsEl(elementMap, elementConfig);
    //将注册的事件注入到props中
    forEach(elementConfig.highConfig$?.registerEventList, (item) => {
      const eventFun = (...params: any[]) => {
        const type = `${elementConfig.elementId}-${item.name}`;
        sendEvent({ type, payload: params });
        execute(item.executeList!, params);
      };
      const path = restorePath(item.name, elementProps!);
      if (elementProps && isValidPath(path) && isPathHasParent(path, elementProps!)) {
        set(elementProps, path, eventFun);
      }
    });

    //receiveStateList 订阅
    const receiveStates = computed(() => {
      if (!highConfig$.registerStateList || size(highConfig$.registerStateList) <= 0) {
        return undefined;
      }
      const changeProps = { ...elementProps };
      //赋值 && 返回一级属性名称
      //标记为props的项（包括缺省）
      const propStateList = filter(highConfig$.registerStateList, (item) => !item.target || item.target === "prop");
      const firstPropNameList = map(propStateList, (item) => {
        const targetName = item.mapName || item.name;
        //从state中取值
        const value = get(state, item.name);
        //赋值
        set(changeProps, targetName, value);
        //返回一级属性名称
        return getFirstPropName(targetName);
      });
      return pick(changeProps, firstPropNameList as string[]);
    });

    // slots
    const El = get(elementMap, elementConfig.elementType) || elementConfig.elementType;
    const slots = convertSlots(elementMap, elementConfig);
    //state中注册的slot
    const stateSlots = reduce(
      filter(highConfig$.registerStateList, (item) => item.target === "slot"),
      (pair, item) => ({ ...pair, [item.mapName as string]: () => get(state, item.name) }),
      {},
    );
    const reSlots = { ...slots, ...stateSlots };

    return () => {
      //如果标记show$值为false，不渲染组件
      const show$ = get(receiveStates.value, "show$");
      if (show$ === false) {
        return null;
      }

      return h(El, { key: elementConfig.elementId, ...elementProps, ...omit(receiveStates.value, "show$") }, reSlots);
    };
  },
});
