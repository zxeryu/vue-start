import {
  ProForm,
  ProSearchForm,
  ProFormList,
  ProTable,
  ProDesc,
  ProCurdModal,
  ProCurdForm,
  ProCurdDesc,
  ProLayout,
} from "@vue-start/pro";
import { ElForm, ElFormItem, ElDescriptions } from "element-plus";
import { FormMethods } from "./form";
import { ProTable as Table } from "./table";
import { ProModal as Modal } from "./comp/Modal";

export * from "./form";
export * from "./table";
export * from "./comp";

//注入element-plus组件props
ProForm.props = {
  ...ElForm.props,
  ...ProForm.props,
  formMethods: { type: Array, default: FormMethods },
};

ProSearchForm.props = {
  ...ProForm.props,
  ...ProSearchForm.props,
  inline: { type: Boolean, default: true },
};

ProFormList.props = {
  ...ElFormItem.props,
  ...ProFormList.props,
};

ProTable.props = {
  ...Table.props,
  ...ProTable.props,
};

ProDesc.props = {
  ...ElDescriptions.props,
  ...ProDesc.props,
};

ProCurdDesc.props = {
  ...ProDesc.props,
  ...ProCurdDesc.props,
};

ProCurdForm.props = {
  ...ProForm.props,
  ...ProCurdForm.props,
};

ProCurdModal.props = {
  ...Modal.props,
  ...ProCurdModal.props,
};

/*********** ProLayout **********/
ProLayout.props = {
  ...ProLayout.props,
  convertMenuParams: {
    type: Function,
    default: ({ mode, activeKey, openKeys }: any) => ({ mode, defaultActive: activeKey }),
  },
  convertSubMenuParams: {
    type: Function,
    default: (menu: any) => ({ index: menu.value }),
  },
  convertMenuItemParams: {
    type: Function,
    default: (menu: any) => ({ index: menu.value }),
  },
  subMenuSlots: {
    type: Object,
    default: {
      title: (menu: any) => menu.label,
    },
  },
  menuItemSlots: {
    type: Object,
    default: {
      title: (menu: any) => menu.label,
    },
  },
};
