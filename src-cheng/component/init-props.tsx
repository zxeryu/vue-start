import { ProChart } from "@vue-start/chart";
import { Map } from "@vue-start/map";
import { ColumnSetting, IOperateItem, ProPage, ProSearchForm, ProTable, TColumn } from "@vue-start/pro";
import { ElButton, ElIcon, ElMessageBox } from "element-plus";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import { get, omit } from "lodash";
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
