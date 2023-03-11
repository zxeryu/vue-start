import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElSelect, ISelectProps, ElOption, IOptionProps } from "element-plus";
import { TOption } from "@vue-start/pro";
import { keys, map, omit } from "lodash";
import { createExposeObj } from "@vue-start/pro";

const proSelectProps = () => ({
  options: Array as PropType<Array<TOption & IOptionProps>>,
});

export type ProSelectProps = Partial<ExtractPropTypes<ReturnType<typeof proSelectProps>>> & ISelectProps;

export const ProSelect = defineComponent<ProSelectProps>({
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

          {map(props.options, (item: TOption & IOptionProps) => {
            //插槽重写label
            const labelEl = slots.label?.(item);

            return (
              <ElOption key={item.value} {...omit(item, "label")}>
                {labelEl || item.label}
              </ElOption>
            );
          })}

          {slots.default?.()}
        </ElSelect>
      );
    };
  },
});
