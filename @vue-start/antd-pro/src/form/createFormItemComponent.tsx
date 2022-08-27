import { FormItem, FormItemProps } from "ant-design-vue";
import { createFormItemCompFn, ProFormItemProps as ProFormItemPropsOrigin } from "@vue-start/pro";

export const createFormItemComponent = createFormItemCompFn<FormItemProps & ProFormItemPropsOrigin>(
  FormItem,
  (value, setValue, disabled) => {
    return {
      value,
      "onUpdate:value": setValue,
      allowClear: true,
      disabled,
    };
  },
);
