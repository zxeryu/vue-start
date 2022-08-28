import { DefineComponent, defineComponent } from "vue";
import { get, omit } from "lodash";
import { ElDescriptions, ElDescriptionsItem } from "element-plus";
import { createCurdDesc, useProCurd } from "@vue-start/pro";

export interface DescriptionsProps {
  border?: boolean;
  column?: number;
  direction?: "vertical" | "horizontal";
  size?: "default" | "small" | "large";
  title?: string;
  extra?: string;
}

export const ProCurdDesc: DefineComponent<DescriptionsProps> = createCurdDesc(ElDescriptions, ElDescriptionsItem);

export const ProCurdDescConnect = defineComponent({
  setup: () => {
    const { descProps } = useProCurd();
    return () => {
      return <ProCurdDesc {...omit(descProps?.value, "slots")} v-slots={get(descProps?.value, "slots")} />;
    };
  },
});
