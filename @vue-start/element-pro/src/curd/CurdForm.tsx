import { DefineComponent, defineComponent } from "vue";
import { FormMethods, ProForm, ProFormProps } from "../form";
import { get, omit } from "lodash";
import { ElButton } from "element-plus";
import { createCurdForm, CurdCurrentMode, ProCurdAddOrEditProps, useProCurd } from "@vue-start/pro";

export type ProCurdFormProps = ProFormProps & ProCurdAddOrEditProps;

export const ProCurdForm: DefineComponent<ProCurdFormProps> = createCurdForm(
  ProForm,
  ElButton,
  (curdState) => ({
    hideRequiredAsterisk: curdState.mode === CurdCurrentMode.DETAIL,
  }),
  FormMethods,
);

export const ProCurdFormConnect = defineComponent({
  setup: () => {
    const { formProps } = useProCurd();
    return () => {
      return <ProCurdForm {...omit(formProps?.value, "slots")} v-slots={get(formProps?.value, "slots")} />;
    };
  },
});
