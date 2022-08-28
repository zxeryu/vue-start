import { computed, defineComponent } from "vue";
import { useProModule } from "../core";
import { useProCurd } from "./index";
import { get, map, omit } from "lodash";

export const createCurdDesc = (Descriptions: any, DescriptionsItem: any): any => {
  return defineComponent({
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
            <DescriptionsItem key={item.dataIndex as any} label={item.title} {...get(item.extra, "desc")}>
              {getItemVNode(item, value)}
            </DescriptionsItem>
          );
        });
      });

      return () => {
        return (
          <Descriptions {...props} v-slots={omit(slots, "default", "start")}>
            {slots.start?.()}
            {descVNodes}
            {slots.default?.()}
          </Descriptions>
        );
      };
    },
  });
};
