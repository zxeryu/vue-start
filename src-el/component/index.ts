import {
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
} from "@vue-start/element-pro";
import { SelectShow, TextNumberShow, TextShow } from "@el/component/show";

export const elementMap = {
  text: TextShow,
  digit: TextNumberShow,
  date: TextShow,
  time: TextShow,
  select: SelectShow,
  radio: SelectShow,
  checkbox: SelectShow,
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
