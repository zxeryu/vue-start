import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElSelect, ElOption } from "element-plus";
import { TOptions } from "../../types";
import { keys, map, omit } from "lodash";
import { createExposeObj } from "@vue-start/pro";

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
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef));

    const invalidKeys = keys(proSelectProps());
    return () => {
      return (
        <ElSelect
          ref={originRef}
          {...omit(props, invalidKeys)}
          onUpdate:modelValue={(v) => {
            emit("update:modelValue", v ? v : undefined);
          }}
          v-slots={omit(slots, "default")}>
          {slots.start?.()}

          {map(props.options, (item) => (
            <ElOption key={item.value} {...item} />
          ))}

          {slots.default?.()}
        </ElSelect>
      );
    };
  },
});
