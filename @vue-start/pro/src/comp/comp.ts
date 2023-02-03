import { useProConfig } from "../core";
import { get } from "lodash";

/******************************** 原始组件key ********************************/
//Loading
export const LoadingKey = "ProLoading$";
//Row
export const RowKey = "ProRow$";
//Col
export const ColKey = "ProCol$";
//Operate Item
export const ProOperateItemKey = "ProOperateItem$";
//Form
export const FormKey = "ProForm$";
//FormItem
export const FormItemKey = "ProFormItem$";
//Table
export const TableKey = "ProTable$";

/******************************** pro组件key ********************************/
//ProForm
export const ProFormKey = "ProForm$";
//ProTable
export const ProTableKey = "ProTable$";

/**
 * 根据elementKey获取组件
 */
export const useGetCompByKey = () => {
  const { elementMap } = useProConfig();

  return (elementKey: string) => {
    return get(elementMap, elementKey);
  };
};
