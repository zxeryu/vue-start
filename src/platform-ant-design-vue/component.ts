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
  ProLoading,
  ProPagination,
  ProTabs,
  ProForm as Form,
  ProMenus,
  ProUploader,
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

import { ProPreview } from "@vue-start/media";
import { ProChart } from "@vue-start/chart";

export const elementMap = {
  [ElementKeys.LoadingKey]: ProLoading,
  [ElementKeys.RowKey]: Row,
  [ElementKeys.ColKey]: Col,
  [ElementKeys.ButtonKey]: Button,
  [ElementKeys.DescriptionsKey]: Descriptions,
  [ElementKeys.DescriptionsItemKey]: DescriptionsItem,
  [ElementKeys.MenusKey]: ProMenus,
  [ElementKeys.ModalKey]: Modal,
  [ElementKeys.PaginationKey]: ProPagination,
  [ElementKeys.PopoverKey]: Popover,
  [ElementKeys.CheckboxKey]: Checkbox,
  [ElementKeys.FormKey]: Form,
  [ElementKeys.FormItemKey]: FormItem,
  [ElementKeys.TableKey]: Table,
  [TableOperateItemKey]: TableOperateItem,
  [ElementKeys.UploaderKey]: ProUploader,

  [ElementKeys.ProFormKey]: ProForm,
  [ElementKeys.ProSearchFormKey]: ProSearchForm,
  [ElementKeys.ProTableKey]: ProTable,

  loading: ProLoading,

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
  app.component("pro-loading", ProLoading);
  app.component("pro-modal", Modal);
  app.component("pro-pagination", ProPagination);
  app.component("pro-popover", Popover);
  app.component("pro-checkbox", CheckboxGroup);
  app.component("pro-radio", RadioGroup);
  app.component("pro-select", Select);
  app.component("pro-tabs", ProTabs);
  app.component("pro-menus", ProMenus);
  app.component("pro-uploader", ProUploader);
  app.component("pro-uploader-text", ProUploaderText);
  //兼容演示
  app.component("pro-input-number", InputNumber);
  app.component("pro-button", Button);
  //
  app.component("pro-preview", ProPreview);
  app.component("pro-chart", ProChart);
};
