import { computed, defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { TColumn, TColumns, TValueType } from "../../types";
import { get, isArray, isEmpty, isFunction, isObject, map, mergeWith, omit } from "lodash";
import { provideProModule } from "./ctx";

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

  return (
    <Comp
      key={name}
      name={name}
      label={column.title}
      {...itemProps}
      fieldProps={omit(column.formFieldProps, "slots")}
      showProps={column.showProps}
      v-slots={column.formFieldProps?.slots}
    />
  );
};

/**
 *  根据Column生成Item VNode
 * @param elementMap
 * @param column
 * @param value
 */
export const getItemEl = (elementMap: any, column: TColumn, value: any): VNode | null => {
  const valueType = column.valueType || "text";
  const Comp: any = get(elementMap, valueType);
  if (!Comp) {
    return null;
  }
  return (
    <Comp
      {...omit(column.formFieldProps, "slots")}
      showProps={column.showProps}
      value={value}
      v-slots={column.formFieldProps?.slots}
    />
  );
};

const proModuleProps = () => ({
  /**
   * 配置（静态）
   */
  columns: { type: Array as PropType<TColumns> },
  /**
   * 配置（动态）
   * columns动态属性兼容
   */
  columnState: { type: Object as PropType<Record<string, any>> },
  /**
   * 展示组件集
   */
  elementMap: { type: Object as PropType<{ [key: string]: any }> },
  /**
   * 录入组件集
   */
  formElementMap: { type: Object as PropType<{ [key: string]: any }> },
});

export type ProModuleProps = Partial<ExtractPropTypes<ReturnType<typeof proModuleProps>>>;

export const ProModule = defineComponent<ProModuleProps>({
  name: "PModule",
  props: {
    ...(proModuleProps() as any),
  },
  setup: (props, { slots }) => {
    /**
     * columns columnState 合并
     */
    const columns = computed(() => {
      return map(props.columns, (item) => {
        //如果columnState中有值，merge处理
        const mapData = get(props.columnState, getColumnFormItemName(item)!);
        if (isObject(mapData) && !isEmpty(mapData) && !isArray(mapData) && !isFunction(mapData)) {
          //合并
          return mergeWith(item, mapData, (objValue, srcValue) => {
            //如果是数组，替换
            if (isArray(objValue) || isArray(srcValue)) {
              return srcValue;
            }
          });
        }
        return item;
      });
    });

    // 获取FormItem VNode
    const getFormItemVNode = (column: TColumn, needRules: boolean | undefined = true): VNode | null => {
      return getFormItemEl(props.formElementMap, column, needRules);
    };

    // 获取Item VNode
    const getItemVNode = (column: TColumn, value: any): VNode | null => {
      return getItemEl(props.elementMap, column, value);
    };

    provideProModule({
      columns,
      getFormItemVNode,
      getItemVNode,
      elementMap: props.elementMap!,
      formElementMap: props.formElementMap!,
    });

    return () => {
      return slots.default?.();
    };
  },
});
