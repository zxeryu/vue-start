import { computed, defineComponent, ExtractPropTypes, PropType } from "vue";
import { ElementKeys, useGetCompByKey } from "./comp";
import { get, keys, map, omit } from "lodash";
import { mergeState, ProBaseProps, proBaseProps, renderColumn, useProConfig } from "../core";
import { UnwrapNestedRefs } from "@vue/reactivity";

const proDescProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-desc" },
  model: { type: Object as PropType<UnwrapNestedRefs<any>> },
});

export type ProDescProps = Partial<ExtractPropTypes<ReturnType<typeof proDescProps>>> & ProBaseProps;

export const ProDesc = defineComponent<ProDescProps>({
  props: {
    ...proBaseProps,
    ...proDescProps(),
  } as any,
  setup: (props, { slots }) => {
    const { elementMap: elementMapP } = useProConfig();

    const elementMap = props.elementMap || elementMapP;

    const getComp = useGetCompByKey();
    const Descriptions = getComp(ElementKeys.DescriptionsKey);
    const DescriptionsItem = getComp(ElementKeys.DescriptionsItemKey);

    const columns = computed(() => {
      return mergeState(props.columns!, props.columnState, props.columnState2);
    });

    const proBaseKeys = keys(proBaseProps);
    const invalidKeys = keys(proDescProps());

    return () => {
      if (!Descriptions || !DescriptionsItem) {
        return null;
      }
      return (
        <Descriptions class={props.clsName} {...omit(props, ...proBaseKeys, ...invalidKeys, "model")} v-slots={slots}>
          {slots.start?.()}

          {map(columns.value, (item) => {
            const dataIndex = item.dataIndex!;
            const value = get(props.model, dataIndex);

            return (
              <DescriptionsItem
                class={`${props.clsName}-item`}
                {...get(item.extra, "desc")}
                v-slots={{
                  label: () => {
                    return slots.label?.(item) || item.title;
                  },
                }}>
                {slots[dataIndex]?.(value, item) ||
                  slots.value?.(value, item) ||
                  renderColumn(elementMap, item, { value }, { render: "descRender" })}
              </DescriptionsItem>
            );
          })}

          {slots.default?.()}
        </Descriptions>
      );
    };
  },
});
