import { ProFormItem, ProFormItemProps } from "./Form";
import { createFormItemCompFn, ProFormItemProps as ProFormItemPropsOrigin } from "@vue-start/pro";

export const createFormItemComponent = createFormItemCompFn<ProFormItemProps & ProFormItemPropsOrigin>(
  ProFormItem,
  (value, setValue, disabled) => {
    return {
      modelValue: value,
      "onUpdate:modelValue": setValue,
      clearable: true,
      disabled,
    };
  },
);
