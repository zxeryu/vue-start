import { ProForm, ProSearchForm, ProFormList, ProTable, ProDesc } from "@vue-start/pro";
import { ElForm, ElFormItem, ElDescriptions } from "element-plus";
import { FormMethods, ProForm as Form } from "./form/Form";

export * from "./form";
export * from "./table";
export * from "./comp";
export * from "./field";

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
  ...Form.props,
  ...ProTable.props,
};

ProDesc.props = {
  ...ElDescriptions.props,
  ...ProDesc.props,
};
