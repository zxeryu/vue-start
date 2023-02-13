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
export const OperateItemKey = "ProOperateItem$";
//Descriptions
export const DescriptionsKey = "ProDescriptions$";
export const DescriptionsItemKey = "ProDescriptionsItem$";
//Pagination
export const PaginationKey = "Pagination$";
//Modal
export const ModalKey = "Modal$";
//Form
export const FormKey = "Form$";
//FormItem
export const FormItemKey = "FormItem$";
//Table
export const TableKey = "Table$";

/******************************** pro组件key ********************************/
//ProForm
export const ProFormKey = "ProForm$";
//ProSearchForm
export const ProSearchFormKey = "ProSearchForm$";
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
