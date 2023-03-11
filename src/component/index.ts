import {
  ProFormCascader,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextNumber,
  ProFormTimePicker,
  ProFormTreeSelect,
  ProLoading,
  ProForm as Form,
  ProFormItem,
  ProModal,
  ProTable as Table,
  ProPagination,
  ProPopover,
} from "@vue-start/element-pro";
import { SelectShow, TextNumberShow, TextShow } from "@/component/show";
import { ElButton, ElRow, ElCol, ElDescriptions, ElDescriptionsItem, ElCheckbox } from "element-plus";
import { ElementKeys, ProForm, ProSearchForm } from "@vue-start/pro";
import { TableOperateItem, TableOperateItemKey, Table as ProTable } from "@/component/Table";

export const elementMap = {
  [ElementKeys.LoadingKey]: ProLoading,
  [ElementKeys.RowKey]: ElRow,
  [ElementKeys.ColKey]: ElCol,
  [ElementKeys.ButtonKey]: ElButton,
  [ElementKeys.DescriptionsKey]: ElDescriptions,
  [ElementKeys.DescriptionsItemKey]: ElDescriptionsItem,
  [ElementKeys.ModalKey]: ProModal,
  [ElementKeys.PaginationKey]: ProPagination,
  [ElementKeys.PopoverKey]: ProPopover,
  [ElementKeys.CheckboxKey]: ElCheckbox,
  [ElementKeys.FormKey]: Form,
  [ElementKeys.FormItemKey]: ProFormItem,
  [ElementKeys.TableKey]: Table,

  [TableOperateItemKey]: TableOperateItem,

  [ElementKeys.ProFormKey]: ProForm,
  [ElementKeys.ProSearchFormKey]: ProSearchForm,
  [ElementKeys.ProTableKey]: ProTable,

  text: TextShow,
  digit: TextNumberShow,
  date: TextShow,
  time: TextShow,
  select: SelectShow,
  radio: SelectShow,
  checkbox: SelectShow,
};

export const formElementMap = {
  text: ProFormText,
  digit: ProFormTextNumber,
  date: ProFormDatePicker,
  time: ProFormTimePicker,
  select: ProFormSelect,
  treeSelect: ProFormTreeSelect,
  checkbox: ProFormCheckbox,
  radio: ProFormRadio,
  switch: ProFormSwitch,
  cascader: ProFormCascader,
};
