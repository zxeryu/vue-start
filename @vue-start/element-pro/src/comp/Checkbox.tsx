import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElCheckboxGroup, CheckboxGroupProps, ElCheckbox, CheckboxProps, ElCheckboxButton } from "element-plus";
import { get, keys, map, omit } from "lodash";
import { createExposeObj, TOption } from "@vue-start/pro";
import { formatValue, parseValue } from "@vue-start/hooks";

const proCheckboxProps = () => ({
  options: Array as PropType<Array<TOption & CheckboxProps>>,
  fieldNames: { type: Object },
  //待删除，使用 optionType
  buttonStyle: { type: String as PropType<"default" | "button">, default: "default" },
  optionType: { type: String as PropType<"default" | "button">, default: "default" },
  // **************** expose 拓展 **********************
  expMethods: { type: Array as PropType<string[]>, default: () => ["focus", "blur", "selectedLabel"] },
  // **************** value 格式自定义 **********************
  separator$: { type: String }, //分割符
  parseValue$: { type: Function }, //解析value 优先级最高
  formatValue$: { type: Function }, //转换value 优先级最高
});

export type ProCheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof proCheckboxProps>>> & CheckboxGroupProps;

export const ProCheckbox = defineComponent<ProCheckboxProps>({
  props: {
    ...ElCheckboxGroup.props,
    ...proCheckboxProps(),
  },
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef, props.expMethods));

    const reOptions = computed(() => {
      return map(props.options, (item) => {
        return {
          ...item,
          label: get(item, props.fieldNames?.label || "label"),
          value: get(item, props.fieldNames?.value || "value"),
          disabled: get(item, props.fieldNames?.label || "disabled"),
        };
      });
    });

    const modelValue = computed(() => {
      const mv = props.modelValue;

      if (props.parseValue$) return props.parseValue$(mv, props);

      return parseValue(mv, { multiple: true, separator: props.separator$ });
    });

    const handleChange = (v: any) => {
      if (props.formatValue$) {
        emit("update:modelValue", props.formatValue$(v, props));
        return;
      }

      if (props.separator$) {
        emit("update:modelValue", formatValue(v, { multiple: true, separator: props.separator$ }));
        return;
      }
      emit("update:modelValue", v);
    };

    const invalidKeys = [...keys(proCheckboxProps()), "modelValue"];
    return () => {
      return (
        <ElCheckboxGroup
          ref={originRef}
          {...omit(props, invalidKeys)}
          modelValue={modelValue.value}
          onUpdate:modelValue={(v) => handleChange(v)}>
          {slots.start?.()}

          {map(reOptions.value, (item) => {
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
