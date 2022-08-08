import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ElSelect, ElOption } from "element-plus";
import { TOptions } from "../../types";
import { keys, map, omit } from "lodash";

const proSelectProps = () => ({
  options: Array as PropType<TOptions>,
});

export type ProSelectProps = Partial<ExtractPropTypes<ReturnType<typeof proSelectProps>>> & typeof ElSelect.props;

export const ProSelect = defineComponent<ProSelectProps>({
  name: "PSelect",
  props: {
    ...ElSelect.props,
    ...proSelectProps(),
  },
  setup: (props, { slots, emit }) => {
    const invalidKeys = keys(proSelectProps());
    return () => {
      return (
        <ElSelect
          {...omit(props, invalidKeys)}
          onUpdate:modelValue={(v) => {
            emit("update:modelValue", v);
          }}
          v-slots={omit(props, "slots")}>
          {map(props.options, (item) => (
            <ElOption key={item.value} {...item} />
          ))}
          {slots.default?.()}
        </ElSelect>
      );
    };
  },
});
