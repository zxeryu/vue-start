import {
  ElInput,
  ElInputNumber,
  ElDatePicker,
  ElTimePicker,
  ElTreeSelect,
  ElCheckboxGroup,
  ElSwitch,
  ElCascader,
  ElButton,
} from "element-plus";

import { createFormItemComponent } from "./createFormItemComponent";
import { Component, defineComponent } from "vue";
import { ProRadio, ProSelect } from "../field";
import { useProForm } from "@vue-start/pro";

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
  InputComp: ElTreeSelect,
  valueType: "treeSelect",
  name: "PFormTreeSelect",
});
export const ProFormCheckbox = createFormItemComponent({
  InputComp: ElCheckboxGroup,
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
  InputComp: ElCascader,
  valueType: "cascader",
  name: "PFormCascader",
});

export interface ButtonProps {
  size?: "default" | "small" | "large";
  disabled?: boolean;
  type?: "default" | "primary" | "success" | "warning" | "info" | "danger" | "text";
  icon?: string | Component;
  nativeType?: "button" | "submit" | "reset";
  loading?: boolean;
  loadingIcon?: string | Component;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  bg?: boolean;
  autofocus?: boolean;
  round?: boolean;
  circle?: boolean;
  color?: string;
  dark?: boolean;
  autoInsertSpace?: boolean;
}

export const ProSubmitButton = defineComponent<ButtonProps>({
  props: {
    ...ElButton.props,
  },
  setup: (props, { slots, emit }) => {
    const { formRef } = useProForm();

    const handleClick = (e: any) => {
      emit("click", e);
      formRef.value?.submit?.();
    };

    return () => {
      return <ElButton onClick={handleClick} {...(props as any)} v-slots={slots} />;
    };
  },
});
