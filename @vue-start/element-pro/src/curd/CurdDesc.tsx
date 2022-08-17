import { computed, defineComponent } from "vue";
import { get, map, omit } from "lodash";
import { ProCurdList } from "./CurdList";
import { ElDescriptions, ElDescriptionsItem } from "element-plus";
import { useProCurd, useProModule } from "@vue-start/pro";

export interface DescriptionsProps {
  border?: boolean;
  column?: number;
  direction?: "vertical" | "horizontal";
  size?: "default" | "small" | "large";
  title?: string;
  extra?: string;
}

export const ProCurdDesc = defineComponent<DescriptionsProps>({
  props: {
    ...ElDescriptions.props,
  },
  setup: (props, { slots }) => {
    const { getItemVNode } = useProModule();
    const { curdState, descColumns } = useProCurd();

    const descVNodes = computed(() => {
      return map(descColumns.value, (item) => {
        const value = get(curdState.detailData, item.dataIndex!);
        return (
          <ElDescriptionsItem key={item.dataIndex as any} label={item.title} {...get(item.extra, "desc")}>
            {getItemVNode(item, value)}
          </ElDescriptionsItem>
        );
      });
    });

    return () => {
      return (
        <ElDescriptions
          {...props}
          v-slots={{
            default: () => descVNodes.value,
            ...omit(slots, "default"),
          }}
        />
      );
    };
  },
});

export const ProCurdDescConnect = defineComponent({
  setup: () => {
    const { descProps } = useProCurd();
    return () => {
      return <ProCurdList {...omit(descProps?.value, "slots")} v-slots={get(descProps?.value, "slots")} />;
    };
  },
});
