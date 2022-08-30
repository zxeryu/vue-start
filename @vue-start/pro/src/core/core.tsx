import { TActionEvent, TColumn, TElementMap, TValueType } from "../types";
import { computed, defineComponent, h, VNode } from "vue";
import { get, head, isArray, isString, map, omit, pick, reduce, set, size } from "lodash";
import { useProModule } from "./Module";

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
}

/**
 * 组件树描述
 */
export interface IElementConfig {
  elementType: string;
  elementId: string;
  elementProps?: Record<string, any>;
  children?: IElementConfig[];
  highConfig$?: IHighConfig;
}

export const renderElements = (elementMap: TElementMap, elementConfigs: IElementConfig[]): (VNode | null)[] => {
  return map(elementConfigs, (elementConfig) => {
    return renderElement(elementMap, elementConfig);
  });
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

  const children = size(elementConfig.children) > 0 ? renderElements(elementMap, elementConfig.children!) : undefined;
  return h(El, { key: elementConfig.elementId, ...elementConfig.elementProps }, children);
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
      const changeProps = { ...elementConfig.elementProps };
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
    const children = size(elementConfig.children) > 0 ? renderElements(elementMap, elementConfig.children!) : undefined;
    return () => {
      return h(
        El,
        { key: elementConfig.elementId, ...elementConfig.elementProps, ...receiveStates.value, ...events },
        children,
      );
    };
  },
});
