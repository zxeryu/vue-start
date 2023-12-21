import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElCheckboxGroup, CheckboxGroupProps, ElCheckbox, CheckboxProps, ElCheckboxButton } from "element-plus";
import { keys, map, omit } from "lodash";
import { createExposeObj, TOption } from "@vue-start/pro";

const proCheckboxProps = () => ({
  options: Array as PropType<Array<TOption & CheckboxProps>>,
  //待删除，使用 optionType
  buttonStyle: { type: String as PropType<"default" | "button">, default: "default" },
  optionType: { type: String as PropType<"default" | "button">, default: "default" },
});

export type ProCheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof proCheckboxProps>>> & CheckboxGroupProps;

export const ProCheckbox = defineComponent<ProCheckboxProps>({
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
          }}>
          {slots.start?.()}

          {map(props.options, (item) => {
            //插槽重写label
            const labelEl = slots.label?.(item);

            if (props.optionType === "button" || props.buttonStyle === "button") {
              return (
                <ElCheckboxButton key={item.value} {...omit(item, "value")} label={item.value}>
                  {labelEl || item.label}
                </ElCheckboxButton>
              );
            }

            return (
              <ElCheckbox key={item.value} {...item} label={item.value}>
                {labelEl || item.label}
              </ElCheckbox>
            );
          })}

          {slots.default?.()}
        </ElCheckboxGroup>
      );
    };
  },
});
