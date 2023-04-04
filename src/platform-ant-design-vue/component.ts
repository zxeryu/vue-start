import { App } from "@vue/runtime-core";
import {
  Button,
  Row,
  Col,
  Descriptions,
  DescriptionsItem,
  Checkbox,
  InputNumber,
  Table,
  Modal,
  Popover,
  FormItem,
  CheckboxGroup,
  RadioGroup,
  Select,
} from "ant-design-vue";
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
  Loading,
  Pagination,
  Tabs,
  Form,
} from "@vue-start/antd-pro";
import { SelectShow, TextNumberShow, TextShow } from "@/component/show";
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
import { ProPage } from "@/component/Page";

export const elementMap = {
  [ElementKeys.LoadingKey]: Loading,
  [ElementKeys.RowKey]: Row,
  [ElementKeys.ColKey]: Col,
  [ElementKeys.ButtonKey]: Button,
  [ElementKeys.DescriptionsKey]: Descriptions,
  [ElementKeys.DescriptionsItemKey]: DescriptionsItem,
  [ElementKeys.ModalKey]: Modal,
  [ElementKeys.PaginationKey]: Pagination,
  [ElementKeys.PopoverKey]: Popover,
  [ElementKeys.CheckboxKey]: Checkbox,
  [ElementKeys.FormKey]: Form,
  [ElementKeys.FormItemKey]: FormItem,
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
  app.component("pro-form-item", FormItem);
  app.component("pro-search-form", ProSearchForm);
  app.component("pro-desc", ProDesc);
  app.component("pro-grid", ProGrid);
  app.component("pro-list", ProList);
  app.component("pro-operate", ProOperate);
  app.component("pro-curd", ProCurd);
  app.component("pro-modal-curd", ProModalCurd);
  app.component("pro-curd-list", ProCurdList);
  //
  app.component("pro-loading", Loading);
  app.component("pro-modal", Modal);
  app.component("pro-pagination", Pagination);
  app.component("pro-popover", Popover);
  app.component("pro-checkbox", CheckboxGroup);
  app.component("pro-radio", RadioGroup);
  app.component("pro-select", Select);
  app.component("pro-tabs", Tabs);
  //兼容演示
  app.component("pro-input-number", InputNumber);
  app.component("pro-button", Button);
};
