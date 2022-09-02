import { computed, defineComponent } from "vue";
import { useProCurd } from "./ctx";
import { get, map, omit } from "lodash";

export const createCurdDesc = (Descriptions: any, DescriptionsItem: any): any => {
  return defineComponent({
    props: {
      ...Descriptions.props,
      //重写Item content
      renderItem: { type: Function },
    },
    setup: (props, { slots }) => {
      const { getItemVNode, curdState, descColumns } = useProCurd();

      const descVNodes = computed(() => {
        return map(descColumns.value, (item) => {
          const vn = props.renderItem?.(item);
          if (vn) {
            return vn;
          }
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
            {descVNodes.value}
            {slots.default?.()}
          </Descriptions>
        );
      };
    },
  });
};
