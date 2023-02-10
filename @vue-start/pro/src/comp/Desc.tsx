import { computed, defineComponent, ExtractPropTypes, PropType } from "vue";
import { DescriptionsItemKey, DescriptionsKey, useGetCompByKey } from "./comp";
import { get, keys, map, omit } from "lodash";
import { getItemEl, ProBaseProps, proBaseProps, useProConfig } from "../core";
import { UnwrapNestedRefs } from "@vue/reactivity";
import { mergeStateToList } from "../util";

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
    const Descriptions = getComp(DescriptionsKey);
    const DescriptionsItem = getComp(DescriptionsItemKey);

    const columns = computed(() => {
      return mergeStateToList(props.columns!, props.columnState!, "dataIndex");
    });

    const propNames = map(props.columns, (item) => item.dataIndex!);

    const descSlots = omit(slots, ...propNames, ...map(propNames, (item) => item + "Label"));

    const proBaseKeys = keys(proBaseProps);
    const invalidKeys = keys(proDescProps());

    return () => {
      if (!Descriptions || !DescriptionsItem) {
        return null;
      }
      return (
        <Descriptions
          class={props.clsName}
          {...omit(props, ...proBaseKeys, ...invalidKeys, "model")}
          v-slots={descSlots}>
          {map(columns.value, (item) => {
            const dataIndex = item.dataIndex!;
            const value = get(props.model, dataIndex);
            return (
              <DescriptionsItem
                class={`${props.clsName}-item`}
                {...get(item.extra, "desc")}
                label={slots[`${dataIndex}Label`] ? slots[`${dataIndex}Label`]!() : item.title}>
                {slots[dataIndex] ? slots[dataIndex]!() : getItemEl(elementMap, item, value)}
              </DescriptionsItem>
            );
          })}
        </Descriptions>
      );
    };
  },
});
