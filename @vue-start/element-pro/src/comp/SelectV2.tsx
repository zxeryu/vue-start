import { computed, defineComponent, PropType, ref, watch } from "vue";
import { ElSelectV2 } from "element-plus";
import { get, keys, map, omit } from "lodash";
import { createExposeObj, formatValue, parseValue } from "@vue-start/hooks";
import { TOption } from "@vue-start/pro";

const proSelectV2Props = () => ({
  options: Array as PropType<Array<TOption>>,
  fieldNames: Object,
  // **************** expose 拓展 **********************
  expMethods: { type: Array as PropType<string[]>, default: () => ["focus", "blur", "selectedLabel"] },
  // **************** value 格式自定义 **********************
  separator$: String, // 分割符
  parseValue$: Function, // 解析 value 优先级最高
  formatValue$: Function, // 转换 value 优先级最高
});

export const ProSelectV2 = defineComponent({
  name: "ProSelectV2",
  props: {
    ...ElSelectV2.props,
    ...proSelectV2Props(),
  },
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef, props.expMethods));

    // 处理 options 字段映射
    const reOptions = computed(() => {
      return map(props.options, (item) => {
        return {
          ...item,
          label: get(item, props.fieldNames?.label || "label"),
          value: get(item, props.fieldNames?.value || "value"),
          disabled: get(item, props.fieldNames?.disabled || "disabled"),
        };
      });
    });

    // 处理 modelValue
    const modelValue = computed(() => {
      const mv = props.modelValue;

      if (props.parseValue$) return props.parseValue$(mv, props);

      return parseValue(mv, { multiple: props.multiple, separator: props.separator$ });
    });

    // 处理 value 变化
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

    const invalidKeys = [...keys(proSelectV2Props()), "modelValue"];

    return () => {
      return (
        <ElSelectV2
          ref={originRef}
          {...omit(props, invalidKeys)}
          modelValue={modelValue.value}
          onUpdate:modelValue={(v) => handleChange(v)}
          options={reOptions.value}
          v-slots={slots}
        />
      );
    };
  },
});
