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
  ProCheckbox,
  ProRadio,
  ProSelect,
  ProTabs,
} from "@vue-start/element-pro";
import { SelectShow, TextNumberShow, TextShow } from "@/component/show";
import { ElButton, ElRow, ElCol, ElDescriptions, ElDescriptionsItem, ElCheckbox } from "element-plus";
import {
  ElementKeys,
  ProCurd,
  ProCurdList,
  ProForm,
  ProModalCurd,
  ProSearchForm,
  ProDesc,
  ProGrid,
  ProList,
  ProOperate,
} from "@vue-start/pro";
import { TableOperateItem, TableOperateItemKey, ProTable } from "@/component/Table";
import { App } from "@vue/runtime-core";

import { ProPage } from "@/component/Page";

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

export const initComp = (app: App) => {
  app.component("pro-page", ProPage);
  app.component("pro-table", ProTable);
  app.component("pro-form", ProForm);
  app.component("pro-search-form", ProSearchForm);
  app.component("pro-desc", ProDesc);
  app.component("pro-grid", ProGrid);
  app.component("pro-list", ProList);
  app.component("pro-operate", ProOperate);
  app.component("pro-curd", ProCurd);
  app.component("pro-modal-curd", ProModalCurd);
  app.component("pro-curd-list", ProCurdList);
  //element-plus
  app.component("pro-loading", ProLoading);
  app.component("pro-modal", ProModal);
  app.component("pro-pagination", ProPagination);
  app.component("pro-popover", ProPopover);
  app.component("pro-checkbox", ProCheckbox);
  app.component("pro-radio", ProRadio);
  app.component("pro-select", ProSelect);
  app.component("pro-tabs", ProTabs);
};
