import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { TOptions } from "../../types";
import { ElCheckboxGroup, ElCheckbox } from "element-plus";
import { keys, map, omit } from "lodash";
import { createExposeObj } from "@vue-start/pro";

const proCheckboxProps = () => ({
  options: Array as PropType<TOptions>,
});

export type ProCheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof proCheckboxProps>>> &
  typeof ElCheckboxGroup.props;

export const ProCheckbox = defineComponent({
  props: {
    ...ElCheckboxGroup.props,
    ...proCheckboxProps(),
  },
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef));

    const invalidKeys = keys(proCheckboxProps());
    return () => {
      return (
        <ElCheckboxGroup
          ref={originRef}
          {...omit(props, invalidKeys)}
          onUpdate:modelValue={(v) => {
            emit("update:modelValue", v ? v : undefined);
          }}
          v-slots={omit(slots, "default")}>
          {slots.start?.()}

          {map(props.options, (item) => {
            return (
              <ElCheckbox {...item} label={item.value}>
                {item.label}
              </ElCheckbox>
            );
          })}

          {slots.default?.()}
        </ElCheckboxGroup>
      );
    };
  },
});
