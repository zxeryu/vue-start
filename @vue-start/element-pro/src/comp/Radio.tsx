import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElRadioGroup, RadioGroupProps, ElRadio, RadioProps, ElRadioButton, RadioButtonProps } from "element-plus";
import { createExposeObj, TOption } from "@vue-start/pro";
import { keys, map, omit } from "lodash";

const proRadioProps = () => ({
  options: { type: Array as PropType<Array<TOption & RadioProps & RadioButtonProps>> },
  //待删除，使用 optionType
  buttonStyle: { type: String as PropType<"default" | "button">, default: "default" },
  optionType: { type: String as PropType<"default" | "button">, default: "default" },
});

export type ProRadioProps = Partial<ExtractPropTypes<ReturnType<typeof proRadioProps>>> & Record<string, any>;

export const ProRadio = defineComponent<ProRadioProps>({
  props: {
    ...ElRadioGroup.props,
    ...proRadioProps(),
  },
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef));

    const invalidKeys = keys(proRadioProps());
    return () => {
      return (
        <ElRadioGroup
          ref={originRef}
          {...omit(props, invalidKeys)}
          onUpdate:modelValue={(v) => {
            emit("update:modelValue", v);
          }}>
          {slots.start?.()}

          {map(props.options, (item) => {
            //插槽重写label
            const labelEl = slots.label?.(item);

            if (props.optionType === "button" || props.buttonStyle === "button") {
              return (
                <ElRadioButton key={item.value} {...omit(item, "value")} label={item.value}>
                  {labelEl || item.label}
                </ElRadioButton>
              );
            }
            return (
              <ElRadio key={item.value} {...omit(item, "value")} label={item.value}>
                {labelEl || item.label}
              </ElRadio>
            );
          })}

          {slots.default?.()}
        </ElRadioGroup>
      );
    };
  },
});
