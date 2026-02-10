import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { ElSelect, ISelectProps, ElOption } from "element-plus";
import { TOption } from "@vue-start/pro";
import { get, keys, map, omit } from "lodash";
import { createExposeObj } from "@vue-start/pro";
import { formatValue, parseValue } from "@vue-start/hooks";

const proSelectProps = () => ({
  options: Array as PropType<Array<TOption>>,
  fieldNames: { type: Object },
  // **************** expose 拓展 **********************
  expMethods: { type: Array as PropType<string[]>, default: () => ["focus", "blur", "selectedLabel"] },
  // **************** value 格式自定义 **********************
  separator$: { type: String }, //分割符
  parseValue$: { type: Function }, //解析value 优先级最高
  formatValue$: { type: Function }, //转换value 优先级最高
});

export type ProSelectProps = Partial<ExtractPropTypes<ReturnType<typeof proSelectProps>>> & ISelectProps;

export const ProSelect = defineComponent<ProSelectProps>({
  props: {
    ...ElSelect.props,
    ...proSelectProps(),
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

      return parseValue(mv, { multiple: props.multiple, separator: props.separator$ });
    });

    const handleChange = (v: any) => {
      if (props.formatValue$) {
        emit("update:modelValue", props.formatValue$(v, props));
        return;
      }

      if (props.separator$) {
        emit("update:modelValue", formatValue(v, { multiple: props.multiple, separator: props.separator$ }));
        return;
      }
      emit("update:modelValue", v);
    };

    const invalidKeys = [...keys(proSelectProps()), "modelValue"];
    return () => {
      return (
        <ElSelect
          ref={originRef}
          {...omit(props, invalidKeys)}
          modelValue={modelValue.value}
          onUpdate:modelValue={(v) => handleChange(v)}
          v-slots={omit(slots, "default")}>
          {slots.start?.()}

          {map(reOptions.value, (item: TOption) => {
            //插槽重写label
            const labelEl = slots.label?.(item);

            return (
              <ElOption key={item.value} {...item}>
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
