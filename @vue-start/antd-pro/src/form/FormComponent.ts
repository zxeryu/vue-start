import {
  Input,
  Textarea,
  InputPassword,
  InputNumber,
  DatePicker,
  TimePicker,
  Select,
  TreeSelect,
  Checkbox,
  Radio,
  Switch,
  Cascader,
} from "ant-design-vue";
import { createFormItemComponent } from "./createFormItemComponent";

export const ProFormText = createFormItemComponent({
  InputComp: Input,
  valueType: "text",
  name: "PFromText",
});
export const ProFormTextArea = createFormItemComponent({
  InputComp: Textarea,
  valueType: "textarea",
  name: "PFromTextarea",
});
export const ProFormTextPassword = createFormItemComponent({
  InputComp: InputPassword,
  valueType: "password",
  name: "PFormPassword",
});
export const ProFormTextNumber = createFormItemComponent({
  InputComp: InputNumber,
  valueType: "digit",
  name: "PFormNumber",
});
export const ProFormDatePicker = createFormItemComponent({
  InputComp: DatePicker,
  valueType: "date",
  name: "PFormDate",
});
export const ProFormDateRangePicker = createFormItemComponent({
  InputComp: DatePicker.RangePicker,
  valueType: "dateRange",
  name: "PFormDateRange",
});
export const ProFormTimePicker = createFormItemComponent({
  InputComp: TimePicker,
  valueType: "time",
  name: "PFormTime",
});
export const ProFormTimeRangePicker = createFormItemComponent({
  InputComp: TimePicker.RangePicker,
  valueType: "timeRange",
  name: "PFormTimeRange",
});
export const ProFormSelect = createFormItemComponent({
  InputComp: Select,
  valueType: "select",
  name: "PFormSelect",
});
export const ProFormTreeSelect = createFormItemComponent({
  InputComp: TreeSelect,
  valueType: "treeSelect",
  name: "PFormTreeSelect",
});
export const ProFormCheckbox = createFormItemComponent({
  InputComp: Checkbox.Group,
  valueType: "checkbox",
  name: "PFromCheckbox",
});
export const ProFormRadio = createFormItemComponent({
  InputComp: Radio.Group,
  valueType: "radio",
  name: "PFromRadio",
});
export const ProFormSwitch = createFormItemComponent({
  InputComp: Switch,
  valueType: "switch",
  name: "PFromSwitch",
});
export const ProFormCascader = createFormItemComponent({
  InputComp: Cascader,
  valueType: "cascader",
  name: "PFormCascader",
});
