import { useProConfig } from "../core";
import { get } from "lodash";

/******************************** 组件key ********************************/

export const ElementKeys = {
  TypographyKey: "Typography$", //Typography
  LoadingKey: "Loading$", //Loading
  RowKey: "Row$", //Row
  ColKey: "Col$", //Col
  ButtonKey: "Button$", //Button
  DescriptionsKey: "ProDescriptions$", //Descriptions
  DescriptionsItemKey: "ProDescriptionsItem$",
  PaginationKey: "Pagination$", //Pagination
  PopoverKey: "Popover$", //Popover
  CheckboxKey: "Checkbox$", //Checkbox
  MenusKey: "Menus$",
  ModalKey: "Modal$", //Modal
  FormKey: "Form$", //Form
  FormItemKey: "FormItem$", //FormItem
  TableKey: "Table$", //Table
  UploaderKey: "Uploader$", //Uploader
  //pro
  ProFormKey: "ProForm$", //ProForm
  ProSearchFormKey: "ProSearchForm$", //ProSearchForm
  ProTableKey: "ProTable$", //ProTable
};

/**
 * 根据elementKey获取组件
 */
export const useGetCompByKey = () => {
  const { elementMap } = useProConfig();

  return (elementKey: string) => {
    return get(elementMap, elementKey);
  };
};
