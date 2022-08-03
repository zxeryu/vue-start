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

export const FormText = createFormItemComponent({
  InputComp: Input,
  valueType: "text",
  name: "PFromText",
});
export const FormTextArea = createFormItemComponent({
  InputComp: Textarea,
  valueType: "textarea",
  name: "PFromTextarea",
});
export const FormTextPassword = createFormItemComponent({
  InputComp: InputPassword,
  valueType: "password",
  name: "PFormPassword",
});
export const FormTextNumber = createFormItemComponent({
  InputComp: InputNumber,
  valueType: "digit",
  name: "PFormNumber",
});
export const FormDatePicker = createFormItemComponent({
  InputComp: DatePicker,
  valueType: "date",
  name: "PFormDate",
});
export const FormDateRangePicker = createFormItemComponent({
  InputComp: DatePicker.RangePicker,
  valueType: "dateRange",
  name: "PFormDateRange",
});
export const FormTimePicker = createFormItemComponent({
  InputComp: TimePicker,
  valueType: "time",
  name: "PFormTime",
});
export const FormTimeRangePicker = createFormItemComponent({
  InputComp: TimePicker.RangePicker,
  valueType: "timeRange",
  name: "PFormTimeRange",
});
export const FormSelect = createFormItemComponent({
  InputComp: Select,
  valueType: "select",
  name: "PFormSelect",
});
export const FormTreeSelect = createFormItemComponent({
  InputComp: TreeSelect,
  valueType: "treeSelect",
  name: "PFormTreeSelect",
});
export const FormCheckbox = createFormItemComponent({
  InputComp: Checkbox.Group,
  valueType: "checkbox",
  name: "PFromCheckbox",
});
export const FormRadio = createFormItemComponent({
  InputComp: Radio.Group,
  valueType: "radio",
  name: "PFromRadio",
});
export const FormSwitch = createFormItemComponent({
  InputComp: Switch,
  valueType: "switch",
  name: "PFromSwitch",
});
export const FormCascader = createFormItemComponent({
  InputComp: Cascader,
  valueType: "cascader",
  name: "PFormCascader",
});
