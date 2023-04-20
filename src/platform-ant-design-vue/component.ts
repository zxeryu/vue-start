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
  Menus,
  Uploader,
} from "@vue-start/antd-pro";
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
  ProShowText,
  ProShowDigit,
  ProShowDate,
  ProShowOptions,
  ProShowTree,
  ProUploaderText,
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
  [ElementKeys.MenusKey]: Menus,
  [ElementKeys.ModalKey]: Modal,
  [ElementKeys.PaginationKey]: Pagination,
  [ElementKeys.PopoverKey]: Popover,
  [ElementKeys.CheckboxKey]: Checkbox,
  [ElementKeys.FormKey]: Form,
  [ElementKeys.FormItemKey]: FormItem,
  [ElementKeys.TableKey]: Table,
  [TableOperateItemKey]: TableOperateItem,
  [ElementKeys.UploaderKey]: Uploader,

  [ElementKeys.ProFormKey]: ProForm,
  [ElementKeys.ProSearchFormKey]: ProSearchForm,
  [ElementKeys.ProTableKey]: ProTable,

  text: ProShowText,
  digit: ProShowDigit,
  date: ProShowDate,
  time: ProShowText,
  select: ProShowOptions,
  radio: ProShowOptions,
  checkbox: ProShowOptions,
  treeSelect: ProShowTree,
  cascader: ProShowTree,
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
  app.component("pro-menus", Menus);
  app.component("pro-uploader", Uploader);
  app.component("pro-uploader-text", ProUploaderText);
  //兼容演示
  app.component("pro-input-number", InputNumber);
  app.component("pro-button", Button);
};
