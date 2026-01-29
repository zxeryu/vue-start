import { createExposeObj, formatValue, parseValue } from "@vue-start/hooks";
import { ElCascader } from "element-plus";
import { keys, omit } from "lodash";
import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue";

const proCascaderProps = () => ({
  // **************** 属性提升 (从props) **********************
  expandTrigger: { type: String, default: "click" },
  multiple: { type: Boolean, default: false },
  checkStrictly: { type: Boolean, default: false },
  emitPath: { type: Boolean, default: true },
  //相当于 cascader组件的props的 value、label、children、disabled、leaf
  fieldNames: { type: Object },
  // **************** expose 拓展 **********************
  expMethods: {
    type: Array as PropType<string[]>,
    default: () => ["getCheckedNodes", "togglePopperVisible", "focus", "blur"],
  },
  // **************** value 格式自定义 **********************
  separator$: { type: String }, //分割符
  itemSeparator$: { type: String }, //单个值分割符
  parseValue$: { type: Function }, //解析value 优先级最高
  formatValue$: { type: Function }, //转换value 优先级最高
});

export type ProCascaderProps = Partial<ExtractPropTypes<ReturnType<typeof proCascaderProps>>>;

export const ProCascader = defineComponent({
  props: {
    ...ElCascader.props,
    ...proCascaderProps(),
  },
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef, props.expMethods));

    const reProps = computed(() => {
      return {
        ...props.fieldNames,
        expandTrigger: props.expandTrigger,
        multiple: props.multiple,
        checkStrictly: props.checkStrictly,
        emitPath: props.emitPath,
        ...props.props,
      };
    });

    const modelValue = computed(() => {
      const mv = props.modelValue;

      if (props.parseValue$) return props.parseValue$(mv, props);

      return parseValue(mv, {
        multiple: reProps.value.multiple,
        allPath: reProps.value.emitPath,
        separator: props.separator$,
        itemSeparator: props.itemSeparator$,
      });
    });

    const handleChange = (v: any) => {
      if (props.formatValue$) {
        emit("update:modelValue", props.formatValue$(v, props));
        return;
      }

      if (props.separator$ || props.itemSeparator$) {
        emit(
          "update:modelValue",
          formatValue(v, {
            multiple: reProps.value.multiple,
            allPath: reProps.value.emitPath,
            separator: props.separator$,
            itemSeparator: props.itemSeparator$,
          }),
        );
        return;
      }

      emit("update:modelValue", v);
    };

    const invalidKeys = [...keys(proCascaderProps()), "modelValue", "props"];

    return () => {
      return (
        <ElCascader
          ref={originRef}
          {...omit(props, invalidKeys)}
          modelValue={modelValue.value}
          onUpdate:modelValue={(v: any) => handleChange(v)}
          props={reProps.value}
          v-slots={slots}
        />
      );
    };
  },
});
