import { ElInput, ElInputNumber, ElDatePicker, ElTimePicker, ElSwitch, ElColorPicker } from "element-plus";

import { createFormItemComponent } from "./createFormItemComponent";
import { InputNumberRange, ProCheckbox, ProRadio, ProSelect, ProCascader, ProTreeSelect } from "../comp";

export const ProFormText = createFormItemComponent({
  InputComp: ElInput,
  valueType: "text",
  name: "PFromText",
});
export const ProFormTextNumber = createFormItemComponent({
  InputComp: ElInputNumber,
  valueType: "digit",
  name: "PFormNumber",
});
export const ProFormInputNumberRange = createFormItemComponent({
  InputComp: InputNumberRange,
  valueType: "digitRange",
  name: "PFormNumberRange",
});
export const ProFormDatePicker = createFormItemComponent({
  InputComp: ElDatePicker,
  valueType: "date",
  name: "PFormDate",
});
export const ProFormTimePicker = createFormItemComponent({
  InputComp: ElTimePicker,
  valueType: "time",
  name: "PFormTime",
});
export const ProFormSelect = createFormItemComponent({
  InputComp: ProSelect,
  valueType: "select",
  name: "PFormSelect",
});
export const ProFormTreeSelect = createFormItemComponent({
  InputComp: ProTreeSelect,
  valueType: "treeSelect",
  name: "PFormTreeSelect",
});
export const ProFormCheckbox = createFormItemComponent({
  InputComp: ProCheckbox,
  valueType: "checkbox",
  name: "PFromCheckbox",
});
export const ProFormRadio = createFormItemComponent({
  InputComp: ProRadio,
  valueType: "radio",
  name: "PFromRadio",
});
export const ProFormSwitch = createFormItemComponent({
  InputComp: ElSwitch,
  valueType: "switch",
  name: "PFromSwitch",
});
export const ProFormCascader = createFormItemComponent({
  InputComp: ProCascader,
  valueType: "cascader",
  name: "PFormCascader",
});
export const ProFormColor = createFormItemComponent({
  InputComp: ElColorPicker,
  valueType: "color",
  name: "PFormColor",
});
