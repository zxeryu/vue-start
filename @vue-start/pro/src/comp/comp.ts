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
  TooltipKey: "Tooltip$", //Tooltip
  CheckboxKey: "Checkbox$", //Checkbox
  MenusKey: "Menus$",
  ModalKey: "Modal$", //Modal
  ScrollKey: "Scroll$",
  PageKey: "Page$",
  FormKey: "Form$", //Form
  FormItemKey: "FormItem$", //FormItem
  TableKey: "Table$", //Table
  TableOperateKey: "TableOperate$", //Table operate item
  UploaderKey: "Uploader$", //Uploader
  EmptyKey: "Empty$",
  DropdownKey: "Dropdown$",
  //pro
  ProFormKey: "ProForm$", //ProForm
  ProSearchFormKey: "ProSearchForm$", //ProSearchForm
  ProTableKey: "ProTable$", //ProTable
  ProCurdKey: "ProCurd$", //ProCurd
  ProListKey: "ProList$", //ProCurd
  ProPageKey: "ProPage$",
  ProOperateKey: "ProOperate$",
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
