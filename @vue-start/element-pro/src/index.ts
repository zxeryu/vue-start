import {
  ProForm,
  ProSearchForm,
  ProFormList,
  ProTable,
  ProDesc,
  ProCurdModal,
  ProCurdForm,
  ProCurdDesc,
  ProList,
  ProUploaderText,
  ElementKeys,
  ProCurd,
  ProShowText,
  ProShowDigit,
  ProShowDate,
  ProShowOptions,
  ProShowTree,
  ProPage,
  ProTip,
  ProOperate,
} from "@vue-start/pro";
import {
  ElForm,
  ElFormItem,
  ElDescriptions,
  ElRow,
  ElCol,
  ElButton,
  ElDescriptionsItem,
  ElCheckbox,
  ElTooltip,
  ElScrollbar,
} from "element-plus";
import {
  FormMethods,
  ProFormItem,
  ProForm as Form,
  ProFormText,
  ProFormTextNumber,
  ProFormInputNumberRange,
  ProFormDatePicker,
  ProFormTimePicker,
  ProFormSelect,
  ProFormTreeSelect,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSwitch,
  ProFormCascader,
} from "./form";
import { ProTable as Table, ProTableOperateItem } from "./table";
import {
  ProUploader,
  ProModal as Modal,
  ProLoading,
  ProMenus,
  ProModal,
  ProPagination,
  ProPopover,
  ProDropdown,
} from "./comp";

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

ProUploaderText.props = {
  ...ProUploader.props,
  ...ProUploaderText.props,
  modelValue: String,
};

ProTip.props = {
  ...ElTooltip.props,
  ...ProTip.props,
  placement: { type: String, default: "top-start" },
};

export const elementMap = {
  //element-plus
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
  [ElementKeys.TooltipKey]: ElTooltip,
  [ElementKeys.CheckboxKey]: ElCheckbox,
  [ElementKeys.FormKey]: Form,
  [ElementKeys.FormItemKey]: ProFormItem,
  [ElementKeys.TableKey]: Table,
  [ElementKeys.TableOperateKey]: ProTableOperateItem,
  [ElementKeys.UploaderKey]: ProUploader,
  [ElementKeys.DropdownKey]: ProDropdown,
  [ElementKeys.ScrollKey]: ElScrollbar,
  //pro
  [ElementKeys.ProFormKey]: ProForm,
  [ElementKeys.ProSearchFormKey]: ProSearchForm,
  [ElementKeys.ProTableKey]: ProTable,
  [ElementKeys.ProCurdKey]: ProCurd,
  [ElementKeys.ProListKey]: ProList,
  [ElementKeys.ProPageKey]: ProPage,
  [ElementKeys.ProOperateKey]: ProOperate,
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
  digitRange: ProFormInputNumberRange,
  date: ProFormDatePicker,
  time: ProFormTimePicker,
  select: ProFormSelect,
  treeSelect: ProFormTreeSelect,
  checkbox: ProFormCheckbox,
  radio: ProFormRadio,
  switch: ProFormSwitch,
  cascader: ProFormCascader,
};
