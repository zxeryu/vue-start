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
import { Form, FormItem, Descriptions, Table, Modal } from "ant-design-vue";
import { FormMethods } from "./form";

export * from "./comp";
export * from "./form";
export * from "./table";

ProForm.props = {
  ...Form.props,
  ...ProForm.props,
  formMethods: { type: Array, default: FormMethods },
};

ProSearchForm.props = {
  ...ProForm.props,
  ...ProSearchForm.props,
  layout: { type: String, default: "inline" },
};

ProFormList.props = {
  ...FormItem.props,
  ...ProFormList.props,
};

ProTable.props = {
  ...Table.props,
  ...ProTable.props,
};

ProDesc.props = {
  ...Descriptions.props,
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
    default: ({ mode, activeKey, openKeys }: any) => ({
      mode: mode === "horizontal" ? mode : "inline",
      selectedKeys: [activeKey],
    }),
  },
  convertSubMenuParams: {
    type: Function,
    default: (menu: any) => ({ key: menu.value, title: menu.label }),
  },
  convertMenuItemParams: {
    type: Function,
    default: (menu: any) => ({ key: menu.value, title: menu.label }),
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
      default: (menu: any) => menu.label,
    },
  },
};
