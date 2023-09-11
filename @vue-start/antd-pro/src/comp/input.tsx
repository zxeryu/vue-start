import { computed, defineComponent, ExtractPropTypes, PropType, ref, VNode } from "vue";
import { InputNumber, InputNumberProps } from "ant-design-vue";
import { get, isNumber, keys, omit } from "lodash";
import { useWatch } from "@vue-start/hooks";

const inputNumberProps = () => ({
  value: { type: Array as PropType<number[]> },
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
  Omit<InputNumberProps, "value">;

export const InputNumberRange = defineComponent<ProInputNumberRangeProps>({
  props: {
    ...omit(InputNumber.props, "value"),
    ...inputNumberProps(),
  } as any,
  setup: (props, { slots, emit }) => {
    const startRef = ref(get(props.value, 0));
    const endRef = ref(get(props.value, 1));

    //标记是否是内部操作引起的变化
    let changeByInside = false;

    useWatch(() => {
      if (!changeByInside) {
        startRef.value = get(props.value, 0);
        endRef.value = get(props.value, 1);
      }
      changeByInside = false;
    }, [props.value, () => props.value]);

    const handleChange = () => {
      changeByInside = true;
      if (props.singleEmit) {
        emit("update:value", [startRef.value, endRef.value]);
      } else {
        if (isNumber(startRef.value) && isNumber(endRef.value)) {
          emit("update:value", [startRef.value, endRef.value]);
        } else {
          emit("update:value", null);
        }
      }
    };

    //获取arr中第一个number元素
    const getNum = (arr: (number | string | undefined)[]) => {
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
          <InputNumber
            {...commonProps}
            {...omit(props.start, "max")}
            max={startMax.value}
            v-model:value={startRef.value}
            onUpdate:value={handleChange}
          />
          <span>{slots.divider?.() || props.divider?.() || " - "}</span>
          <InputNumber
            {...commonProps}
            {...omit(props.start, "min")}
            min={endMin.value}
            v-model:value={endRef.value}
            onUpdate:value={handleChange}
          />
        </span>
      );
    };
  },
});
