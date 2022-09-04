import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ElRadioGroup, ElRadio, ElRadioButton } from "element-plus";
import { TOptions } from "@vue-start/pro";
import { RadioGroupProps } from "element-plus/es/components/radio/src/radio-group";
import { keys, map, omit } from "lodash";

const proRadioProps = () => ({
  options: { type: Array as PropType<TOptions> },
  buttonStyle: { type: String as PropType<"default" | "button">, default: "default" },
});

export type ProRadioProps = Partial<ExtractPropTypes<ReturnType<typeof proRadioProps>>> & RadioGroupProps;

export const ProRadio = defineComponent<ProRadioProps>({
  props: {
    ...ElRadioGroup.props,
    ...proRadioProps(),
  },
  setup: (props, { emit }) => {
    const invalidKeys = keys(proRadioProps());
    return () => {
      return (
        <ElRadioGroup
          {...omit(props, invalidKeys)}
          onUpdate:modelValue={(v) => {
            emit("update:modelValue", v);
          }}>
          {map(props.options, (item) => {
            if (props.buttonStyle === "button") {
              return (
                <ElRadioButton key={item.value} {...item} label={item.value}>
                  {item.label}
                </ElRadioButton>
              );
            }
            return (
              <ElRadio key={item.value} {...item} label={item.value}>
                {item.label}
              </ElRadio>
            );
          })}
        </ElRadioGroup>
      );
    };
  },
});
