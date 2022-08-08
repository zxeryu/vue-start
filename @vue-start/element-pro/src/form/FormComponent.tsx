import {
  ElInput,
  ElInputNumber,
  ElDatePicker,
  ElTimePicker,
  ElTreeSelect,
  ElCheckboxGroup,
  ElRadioGroup,
  ElSwitch,
  ElCascader,
  ElButton,
  ButtonProps,
} from "element-plus";

import { createFormItemComponent } from "./createFormItemComponent";
import { defineComponent } from "vue";
import { useProForm } from "./ctx";
import { ProSelect } from "../field";

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
  InputComp: ElRadioGroup,
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

export const ProSubmitButton = defineComponent<ButtonProps & Record<string, any>>({
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
      return <ElButton onClick={handleClick} type={"submit"} {...(props as any)} v-slots={slots} />;
    };
  },
});
