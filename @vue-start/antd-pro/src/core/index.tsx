import { TColumn, TValueType } from "../../types";
import { VNode } from "vue";
import { get, omit } from "lodash";

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
