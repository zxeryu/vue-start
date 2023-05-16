import { App } from "@vue/runtime-core";
import { ElButton, ElInputNumber, ElMessageBox, ElIcon } from "element-plus";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import {
  ProLoading,
  ProFormItem,
  ProModal,
  ProPagination,
  ProPopover,
  ProCheckbox,
  ProRadio,
  ProSelect,
  ProTabs,
  ProMenus,
  ProUploader,
  elementMap as elementMapOrigin,
  formElementMap as formElementMapOrigin,
} from "@vue-start/element-pro";
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
} from "@vue-start/pro";

import { ProPreview } from "@vue-start/media";
import { ProChart } from "@vue-start/chart";
import { Map } from "@vue-start/map";
import { css } from "@emotion/css";

ProChart.props = {
  ...ProChart.props,
  loadingOpts: { type: Object, default: { lineWidth: 2, spinnerRadius: 14, text: "", color: "#409eff" } },
};

Map.props = {
  ...Map.props,
  loadOpts: { type: Object, default: { key: "e576dc4fdf66a1f0334d9ae4615a62ea" } },
};

ColumnSetting.props = {
  ...ColumnSetting.props,
  renderDom: { type: Function, default: () => <ElButton icon={"Setting"} circle /> },
};
ProTable.props = {
  ...ProTable.props,
  //全局定义Table删除按钮（value为DELETE） 的颜色
  operateItemState: {
    type: Object,
    default: { DELETE: { extraProps: { type: "danger" } } },
  },
  //全局拦截删除按钮事件
  operateItemClickMap: {
    type: Object,
    default: {
      DELETE: (record: Record<string, any>, item: IOperateItem) => {
        ElMessageBox.confirm("确定删除当前数据吗？", "删除").then(() => {
          item.onClick?.(record);
        });
      },
    },
  },
};

ProPage.props = {
  ...ProPage.props,
  renderBackIcon: {
    type: Function,
    default: () => (
      <span class={css({ display: "flex", alignItems: "center" })}>
        <ElIcon>
          <ArrowLeftBold />
        </ElIcon>
        <span class={css({ fontSize: 14 })}>返回</span>
      </span>
    ),
  },
};

export const elementMap = {
  ...elementMapOrigin,
};

export const formElementMap = {
  ...formElementMapOrigin,
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
