import { computed, defineComponent } from "vue";
import { Descriptions, DescriptionsProps } from "ant-design-vue";
import { get, map, omit } from "lodash";
import { useProCurd, useProModule } from "@vue-start/pro";

export const ProCurdDesc = defineComponent<DescriptionsProps>({
  props: {
    ...Descriptions.props,
  },
  setup: (props, { slots }) => {
    const { getItemVNode } = useProModule();
    const { curdState, descColumns } = useProCurd();

    const descVNodes = computed(() => {
      return map(descColumns.value, (item) => {
        const value = get(curdState.detailData, item.dataIndex!);
        return (
          <Descriptions.Item key={item.dataIndex as any} label={item.title} {...get(item.extra, "desc")}>
            {getItemVNode(item, value)}
          </Descriptions.Item>
        );
      });
    });

    return () => {
      return (
        <Descriptions
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
      return <ProCurdDesc {...omit(descProps?.value, "slots")} v-slots={get(descProps?.value, "slots")} />;
    };
  },
});
