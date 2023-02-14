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
} from "@vue-start/element-pro";
import { SelectShow, TextNumberShow, TextShow } from "@/component/show";
import { ElButton, ElRow, ElCol, ElDescriptions, ElDescriptionsItem } from "element-plus";
import {
  ColKey,
  DescriptionsItemKey,
  DescriptionsKey,
  FormItemKey,
  FormKey,
  LoadingKey,
  ModalKey,
  OperateItemKey,
  RowKey,
  TableKey,
  ProFormKey,
  ProSearchFormKey,
  ProTableKey,
  ProForm,
  ProSearchForm, PaginationKey,
} from "@vue-start/pro";
import { TableOperateItem, TableOperateItemKey, Table as ProTable } from "@/component/Table";

export const elementMap = {
  [LoadingKey]: ProLoading,
  [RowKey]: ElRow,
  [ColKey]: ElCol,
  [OperateItemKey]: ElButton,
  [DescriptionsKey]: ElDescriptions,
  [DescriptionsItemKey]: ElDescriptionsItem,
  [ModalKey]: ProModal,
  [PaginationKey]: ProPagination,
  [FormKey]: Form,
  [FormItemKey]: ProFormItem,
  [TableKey]: Table,

  [TableOperateItemKey]: TableOperateItem,

  [ProFormKey]: ProForm,
  [ProSearchFormKey]: ProSearchForm,
  [ProTableKey]: ProTable,

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
