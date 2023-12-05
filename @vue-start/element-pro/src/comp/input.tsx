import { computed, defineComponent, ExtractPropTypes, PropType, ref, VNode } from "vue";
import { ElInputNumber, InputNumberProps } from "element-plus";
import { get, isNumber, keys, omit } from "lodash";
import { useWatch } from "@vue-start/hooks";

const inputNumberProps = () => ({
  modelValue: { type: Array as PropType<number[]> },
  //左侧 InputNumber 独有参数
  start: { type: Object as PropType<InputNumberProps> },
  //右侧 InputNumber 独有参数
  end: { type: Object as PropType<InputNumberProps> },
  /**
   * true：     任何change都触发emit
   * false：    两个值都输入，触发emit([v1,v2])，否则，触发emit(null)
   */
  singleEmit: { type: Boolean as PropType<boolean>, default: false },
  /********************slots******************/
  divider: { type: Function as PropType<() => VNode> },
});

export type ProInputNumberRangeProps = Partial<ExtractPropTypes<ReturnType<typeof inputNumberProps>>> &
  Omit<InputNumberProps, "modelValue">;

export const InputNumberRange = defineComponent<ProInputNumberRangeProps>({
  props: {
    ...omit(ElInputNumber.props, "modelValue"),
    //修改默认值
    controlsPosition: { type: String, default: "right" },
    ...inputNumberProps(),
  } as any,
  setup: (props, { slots, emit }) => {
    const startRef = ref(get(props.modelValue, 0));
    const endRef = ref(get(props.modelValue, 1));

    //标记是否是内部操作引起的变化
    let changeByInside = false;

    useWatch(() => {
      if (!changeByInside) {
        startRef.value = get(props.modelValue, 0);
        endRef.value = get(props.modelValue, 1);
      }
      changeByInside = false;
    }, [props.modelValue, () => props.modelValue]);

    const handleChange = () => {
      changeByInside = true;
      if (props.singleEmit) {
        emit("update:modelValue", [startRef.value, endRef.value]);
      } else {
        if (isNumber(startRef.value) && isNumber(endRef.value)) {
          emit("update:modelValue", [startRef.value, endRef.value]);
        } else {
          emit("update:modelValue", null);
        }
      }
    };

    //获取arr中第一个number元素
    const getNum = (arr: (number | undefined)[]) => {
      for (let i = 0; i < arr.length; i++) {
        if (isNumber(arr[i])) return arr[i];
      }
      return undefined;
    };

    const startMax = computed(() => getNum([endRef.value, props.start?.max, props.max]));
    const endMin = computed(() => getNum([startRef.value, props.end?.min, props.min]));

    const ignoreKeys = keys(inputNumberProps());

    return () => {
      const commonProps = omit(props, ...ignoreKeys, "min", "max");
      return (
        <span class={"pro-number-range"}>
          <ElInputNumber
            {...commonProps}
            {...omit(props.start, "max")}
            max={startMax.value}
            v-model:modelValue={startRef.value}
            onUpdate:modelValue={handleChange}
          />
          <span>{slots.divider?.() || props.divider?.() || " - "}</span>
          <ElInputNumber
            {...commonProps}
            {...omit(props.start, "min")}
            min={endMin.value}
            v-model:modelValue={endRef.value}
            onUpdate:modelValue={handleChange}
          />
        </span>
      );
    };
  },
});
