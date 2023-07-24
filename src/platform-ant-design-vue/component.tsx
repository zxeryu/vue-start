import { App } from "@vue/runtime-core";
import { Button, InputNumber, Modal, Popover, FormItem, CheckboxGroup, RadioGroup, Select } from "ant-design-vue";
import SettingOutlined from "@ant-design/icons-vue/lib/icons/SettingOutlined";
import ArrowLeftOutlined from "@ant-design/icons-vue/lib/icons/ArrowLeftOutlined";

import {
  ProLoading,
  ProPagination,
  ProTabs,
  ProMenus,
  ProUploader,
  elementMap as elementMapOrigin,
  formElementMap as formElementMapOrigin,
} from "@vue-start/antd-pro";
import {
  ProCurd,
  ProCurdList,
  ProForm,
  ProModalCurd,
  ProSearchForm,
  ProPage,
  ProDesc,
  ProGrid,
  ProList,
  ProOperate,
  ProUploaderText,
  ProTypography,
  ProTable,
  ColumnSetting,
  IOperateItem,
  TColumn,
} from "@vue-start/pro";

import { ProPreview } from "@vue-start/media";
import { ProChart } from "@vue-start/chart";
import { Map } from "@vue-start/map";
import { get, omit } from "lodash";

ProChart.props = {
  ...ProChart.props,
  loadingOpts: { type: Object, default: { lineWidth: 2, spinnerRadius: 14, text: "", color: "#1890ff" } },
};

Map.props = {
  ...Map.props,
  loadOpts: { type: Object, default: { key: "e576dc4fdf66a1f0334d9ae4615a62ea" } },
};

ColumnSetting.props = {
  ...ColumnSetting.props,
  renderDom: {
    type: Function,
    default: () => <Button shape={"circle"} v-slots={{ icon: () => <SettingOutlined /> }} />,
  },
};

ProTable.props = {
  ...ProTable.props,
  //全局定义Table删除按钮（value为DELETE） 的颜色
  operateItemState: {
    type: Object,
    default: { DELETE: { extraProps: { danger: true } } },
  },
  //全局拦截删除按钮事件
  operateItemClickMap: {
    type: Object,
    default: {
      DELETE: (record: Record<string, any>, item: IOperateItem) => {
        Modal.confirm({
          title: "删除",
          content: "确定删除当前数据吗？",
          onOk: () => {
            item.onClick?.(record);
          },
        });
      },
    },
  },
};

ProSearchForm.props = {
  ...ProSearchForm.props,
  convertColumn: {
    type: Function,
    default: (item: TColumn) => {
      const nextItem = { ...item, formItemProps: omit(item.formItemProps, "required", "rules") };
      //屏蔽掉ElInput中的 showWordLimit 属性
      if (get(nextItem, ["formFieldProps", "showWordLimit"])) {
        return { ...nextItem, formFieldProps: omit(nextItem.formFieldProps, "showWordLimit") };
      }
      return nextItem;
    },
  },
};

ProPage.props = {
  ...ProPage.props,
  renderBackIcon: {
    type: Function,
    default: () => <ArrowLeftOutlined />,
  },
};

export const elementMap = {
  ...elementMapOrigin,
  ProPage,
  ProTypography,
};

export const formElementMap = {
  ...formElementMapOrigin,
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
  app.component("pro-typography", ProTypography);
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
