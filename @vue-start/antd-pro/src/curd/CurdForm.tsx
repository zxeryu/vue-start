import { DefineComponent, defineComponent } from "vue";
import { ProForm, ProFormProps } from "../form";
import { get, omit } from "lodash";
import { Button } from "ant-design-vue";

import { createCurdForm, CurdCurrentMode, ProCurdAddOrEditProps, useProCurd } from "@vue-start/pro";

export const ProCurdForm: DefineComponent<ProFormProps & ProCurdAddOrEditProps> = createCurdForm(
  ProForm,
  Button,
  (curdState) => ({
    hideRequiredMark: curdState.mode === CurdCurrentMode.DETAIL,
  }),
);

export const ProCurdFormConnect = defineComponent({
  setup: () => {
    const { formProps } = useProCurd();
    return () => {
      return <ProCurdForm {...omit(formProps?.value, "slots")} v-slots={get(formProps?.value, "slots")} />;
    };
  },
});
