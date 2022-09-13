import { TActionEvent, TColumn, TElementMap, TValueType } from "../types";
import { computed, defineComponent, h, VNode, isVNode } from "vue";
import {
  forEach,
  get,
  head,
  isArray,
  isFunction,
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

/***************************************** curd模式 *****************************************/

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
  return (column.formItemProps?.name || column.dataIndex) as any;
};

/**
 * 根据Column生成FormItem VNode
 * formFieldProps中的slots参数会以v-slots的形式传递到FormItem的录入组件（子组件）中
 * @param formElementMap
 * @param column
 * @param needRules
 */
export const getFormItemEl = (
  formElementMap: any,
  column: TColumn,
  needRules: boolean | undefined = true,
): VNode | null => {
  const valueType = getColumnValueType(column);
  const Comp: any = get(formElementMap, valueType);
  if (!Comp) {
    return null;
  }

  const name = getColumnFormItemName(column);
  const itemProps = needRules ? column.formItemProps : omit(column.formItemProps, "rules");

  return h(
    Comp,
    {
      key: name,
      name,
      label: column.title,
      ...itemProps,
      fieldProps: omit(column.formFieldProps, "slots"),
      showProps: column.showProps,
    },
    column.formFieldProps?.slots,
  );
};

/**
 *  根据Column生成Item VNode
 * @param elementMap
 * @param column
 * @param value
 */
export const getItemEl = <T extends TColumn>(elementMap: any, column: T, value: any): VNode | null => {
  const valueType = column.valueType || "text";
  const Comp: any = get(elementMap, valueType);
  if (!Comp) {
    return null;
  }
  return h(
    Comp,
    {
      ...omit(column.formFieldProps, "slots"),
      showProps: column.showProps,
      value,
    },
    column.formFieldProps?.slots,
  );
};

/***************************************** 通用模式 *****************************************/

export declare type InternalNamePath = (string | number)[];
export declare type NamePath = string | number | InternalNamePath;

export interface IHighConfig {
  //注册接受Module的状态
  registerStateList?: {
    //state中的key值
    name: NamePath;
    //组件需要的属性名称；如不存在，用name的值作为属性名称传递给组件
    mapName?: NamePath;
  }[];
  //注册事件
  registerEventList?: {
    //事件名称
    name: string;
    //sendEvent type 名称
    sendEventName?: TActionEvent["type"];
  }[];
  //注册转换的props
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

export const renderElements = (elementMap: TElementMap, elementConfigs: IElementConfig[]): (VNode | null)[] => {
  return map(elementConfigs, (elementConfig) => {
    return renderElement(elementMap, elementConfig);
  });
};

/**
 * props转换
 */
const convertPropsEl = (elementMap: TElementMap, elementConfig: IElementConfig): IElementConfig["elementProps"] => {
  const elementProps = elementConfig.elementProps;
  const nextProps = { ...elementConfig.elementProps };
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
 * slots转换
 */
const convertSlots = (elementMap: TElementMap, elementConfig: IElementConfig): Slots => {
  const children = size(elementConfig.children) > 0 ? renderElements(elementMap, elementConfig.children!) : undefined;
  //children插槽名称
  const childrenSlotName = elementConfig.childrenSlotName || "default";
  const validSlots = omit(elementConfig.slots, children ? childrenSlotName : "");
  //如果slots注册的是 IElementConfig ，进行转换
  forEach(keys(validSlots), (k) => {
    const v = validSlots[k as any];
    //IElementConfig
    if (v && !isFunction(v) && v.elementType) {
      validSlots[k as any] = (...params$) => {
        //如果需要params，在props中注入 params$
        const elementProps = v.needParams ? { ...v.elementProps, params$ } : v.elementProps;
        return renderElement(elementMap, { ...v, elementProps });
      };
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
    const { state, sendEvent } = useProModule();
    const { elementMap, elementConfig } = props;

    const highConfig$ = elementConfig.highConfig$!;
    //转换props
    const elementProps = convertPropsEl(elementMap, elementConfig);

    //事件订阅
    const events = reduce(
      highConfig$.registerEventList,
      (pair, item) => ({
        ...pair,
        [item.name]: (...params: any[]) => {
          sendEvent({ type: item.sendEventName || elementConfig.elementId, payload: params });
        },
      }),
      {},
    );

    //receiveStateList 订阅
    const receiveStates = computed(() => {
      if (!highConfig$.registerStateList || size(highConfig$.registerStateList) <= 0) {
        return undefined;
      }
      const changeProps = { ...elementProps };
      //赋值 && 返回一级属性名称
      const firstPropNameList = map(highConfig$.registerStateList, (item) => {
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

    const El = get(elementMap, elementConfig.elementType) || elementConfig.elementType;
    const slots = convertSlots(elementMap, elementConfig);
    return () => {
      //如果标记show$值为false，不渲染组件
      const show$ = get(receiveStates.value, "show$");
      if (show$ === false) {
        return null;
      }

      return h(
        El,
        { key: elementConfig.elementId, ...elementProps, ...omit(receiveStates.value, "show$"), ...events },
        slots,
      );
    };
  },
});