import {
  FormItem,
  Descriptions,
  Table,
  Modal,
  Row,
  Col,
  Button,
  DescriptionsItem,
  Popover,
  Checkbox,
} from "ant-design-vue";
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
  ElementKeys,
  ProCurd,
  ProList,
  ProShowText,
  ProShowDigit,
  ProShowDate,
  ProShowOptions,
  ProShowTree,
} from "@vue-start/pro";
import {
  FormMethods,
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
} from "./form";
import { ProLoading, ProMenus, ProPagination, ProUploader } from "./comp";
import { ProTableOperateItem } from "./table";
import { ProForm as Form } from "./form";

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

export const elementMap = {
  //ant-design-vue
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
  [ElementKeys.TableOperateKey]: ProTableOperateItem,
  [ElementKeys.UploaderKey]: ProUploader,
  //pro
  [ElementKeys.ProFormKey]: ProForm,
  [ElementKeys.ProSearchFormKey]: ProSearchForm,
  [ElementKeys.ProTableKey]: ProTable,
  [ElementKeys.ProCurdKey]: ProCurd,
  [ElementKeys.ProListKey]: ProList,
  //show
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
