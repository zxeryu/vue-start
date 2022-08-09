import { computed, defineComponent } from "vue";
import { useProCurdModule } from "./ctx";
import { get, map, omit } from "lodash";
import { useProModule } from "../core";
import { ProCurdList } from "./CurdList";
import { ElDescriptions, ElDescriptionsItem } from "element-plus";

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
    const { curdState, descColumns } = useProCurdModule();

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
    const { descProps } = useProCurdModule();
    return () => {
      return <ProCurdList {...omit(descProps, "slots")} v-slots={get(descProps, "slots")} />;
    };
  },
});
