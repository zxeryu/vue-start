import { DefineComponent, defineComponent } from "vue";
import { Descriptions, DescriptionsProps } from "ant-design-vue";
import { get, omit } from "lodash";
import { createCurdDesc, useProCurd } from "@vue-start/pro";

export const ProCurdDesc: DefineComponent<DescriptionsProps> = createCurdDesc(Descriptions, Descriptions.Item);

export const ProCurdDescConnect = defineComponent(() => {
  const { descProps } = useProCurd();
  return () => {
    return <ProCurdDesc {...omit(descProps?.value, "slots")} v-slots={get(descProps?.value, "slots")} />;
  };
});
