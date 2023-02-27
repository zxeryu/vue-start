import { useProConfig } from "../core";
import { get } from "lodash";

/******************************** 原始组件key ********************************/
//Loading
export const LoadingKey = "Loading$";
//Row
export const RowKey = "Row$";
//Col
export const ColKey = "Col$";
//Button
export const ButtonKey = "Button$";
//Descriptions
export const DescriptionsKey = "ProDescriptions$";
export const DescriptionsItemKey = "ProDescriptionsItem$";
//Pagination
export const PaginationKey = "Pagination$";
//Popover
export const PopoverKey = "Popover$";
//Checkbox
export const CheckboxKey = "Checkbox$";
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
