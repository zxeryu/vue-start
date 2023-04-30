import { ElButton, ElRow, ElCol, ElDescriptions, ElDescriptionsItem, ElCheckbox, ElInputNumber } from "element-plus";

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
  ProMenus,
  ProUploader,
} from "@vue-start/element-pro";
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
  ProTypography,
} from "@vue-start/pro";
import { TableOperateItem, TableOperateItemKey, ProTable } from "@/component/Table";

import { ProPreview } from "@vue-start/media";
import { ProChart } from "@vue-start/chart";
import { Map } from "@vue-start/map";

import { App } from "@vue/runtime-core";

import { ProPage } from "@/component/Page";

ProChart.props = {
  ...ProChart.props,
  loadingOpts: { type: Object, default: { lineWidth: 2, spinnerRadius: 14, text: "", color: "#409eff" } },
};

Map.props = {
  ...Map.props,
  loadOpts: {
    type: Object,
    default: { key: "e576dc4fdf66a1f0334d9ae4615a62ea" },
  },
};

export const elementMap = {
  [ElementKeys.LoadingKey]: ProLoading,
  [ElementKeys.RowKey]: ElRow,
  [ElementKeys.ColKey]: ElCol,
  [ElementKeys.ButtonKey]: ElButton,
  [ElementKeys.DescriptionsKey]: ElDescriptions,
  [ElementKeys.DescriptionsItemKey]: ElDescriptionsItem,
  [ElementKeys.MenusKey]: ProMenus,
  [ElementKeys.ModalKey]: ProModal,
  [ElementKeys.PaginationKey]: ProPagination,
  [ElementKeys.PopoverKey]: ProPopover,
  [ElementKeys.CheckboxKey]: ElCheckbox,
  [ElementKeys.FormKey]: Form,
  [ElementKeys.FormItemKey]: ProFormItem,
  [ElementKeys.TableKey]: Table,
  [ElementKeys.UploaderKey]: ProUploader,

  [TableOperateItemKey]: TableOperateItem,

  [ElementKeys.ProFormKey]: ProForm,
  [ElementKeys.ProSearchFormKey]: ProSearchForm,
  [ElementKeys.ProTableKey]: ProTable,

  loading: ProLoading,

  //form show
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
  app.component("pro-form-item", ProFormItem);
  app.component("pro-search-form", ProSearchForm);
  app.component("pro-desc", ProDesc);
  app.component("pro-grid", ProGrid);
  app.component("pro-list", ProList);
  app.component("pro-operate", ProOperate);
  app.component("pro-curd", ProCurd);
  app.component("pro-modal-curd", ProModalCurd);
  app.component("pro-curd-list", ProCurdList);
  app.component("pro-typography", ProTypography);
  //element-plus
  app.component("pro-loading", ProLoading);
  app.component("pro-modal", ProModal);
  app.component("pro-pagination", ProPagination);
  app.component("pro-popover", ProPopover);
  app.component("pro-checkbox", ProCheckbox);
  app.component("pro-radio", ProRadio);
  app.component("pro-select", ProSelect);
  app.component("pro-tabs", ProTabs);
  app.component("pro-menus", ProMenus);
  app.component("pro-uploader", ProUploader);
  app.component("pro-uploader-text", ProUploaderText);
  //兼容演示
  app.component("pro-input-number", ElInputNumber);
  app.component("pro-button", ElButton);
  //预览
  app.component("pro-preview", ProPreview);
  //echarts
  app.component("pro-chart", ProChart);
};
