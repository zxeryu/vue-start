import {
  ProForm,
  ProSearchForm,
  ProFormList,
  ProTable,
  ProDesc,
  ProCurdModal,
  ProCurdForm,
  ProCurdDesc,
  ProUploaderText,
} from "@vue-start/pro";
import { Form, FormItem, Descriptions, Table, Modal } from "ant-design-vue";
import { FormMethods } from "./form";
import { ProUploader } from "./comp";

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

ProUploaderText.props = {
  ...ProUploader.props,
  ...ProUploaderText.props,
  value: String,
};
