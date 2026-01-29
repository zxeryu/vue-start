import { ElTreeSelect } from "element-plus";
import { SelectProps } from "ant-design-vue/lib/vc-select";
import { TreeComponentProps } from "element-plus/es/components/tree/src/tree.type";
import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { createExposeObj, findTreeItem, formatValue, parseValue } from "@vue-start/hooks";
import { get, isArray, keys, last, map, omit } from "lodash";
import { TreeMethods } from "./Tree";

const proTreeSelectProps = () => ({
  options: Array as PropType<Array<Record<string, any>>>,
  //相当于 tree组件的props，多了个value
  fieldNames: { type: Object },
  // 是否使用所有层级的value(同emitPath)
  emitPath: { type: Boolean, default: false },
  // **************** expose 拓展 **********************
  expMethods: { type: Array as PropType<string[]>, default: () => [...TreeMethods] },
  // **************** value 格式自定义 **********************
  separator$: { type: String }, //分割符
  itemSeparator$: { type: String }, //单个值分割符
  parseValue$: { type: Function }, //解析value 优先级最高
  formatValue$: { type: Function }, //转换value 优先级最高
});

export type ProTreeSelectProps = Partial<ExtractPropTypes<ReturnType<typeof proTreeSelectProps>>> &
  SelectProps &
  TreeComponentProps;

export const ProTreeSelect = defineComponent({
  props: {
    ...ElTreeSelect.props,
    ...proTreeSelectProps(),
  },
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef, props.expMethods));

    const data = computed(() => props.options || props.data);

    const fieldNames = computed(() => props.fieldNames || props.props);

    const modelValue = computed(() => {
      const mv = props.modelValue;

      if (props.parseValue$) return props.parseValue$(mv, props);

      const pv = parseValue(mv, {
        multiple: props.multiple,
        allPath: props.emitPath,
        separator: props.separator$,
        itemSeparator: props.itemSeparator$,
      });

      //由于tree-select接收的是单层级value，取最后一个值
      if (isArray(pv)) {
        if (props.multiple) {
          return map(pv, (v) => (isArray(v) ? last(v) : v));
        } else {
          return last(pv);
        }
      }

      return pv;
    });

    const convertValue = (v: any) => {
      let rv = v;

      if (props.emitPath && v) {
        const valueName = fieldNames.value?.value || "value";
        const childrenName = fieldNames.value?.children || "children";
        //补充
        if (isArray(v)) {
          rv = map(v, (item) => {
            //从tree数据中查找出level链
            const t = findTreeItem(data.value, (i) => get(i, valueName) === item, { children: childrenName }, []);
            //value[]
            return map(t.parentList, (i) => get(i, valueName));
          });
        } else {
          //从tree数据中查找出level链
          const t = findTreeItem(data.value, (i) => get(i, valueName) === v, { children: childrenName }, []);
          //value[]
          rv = map(t.parentList, (i) => get(i, valueName));
        }
      }

      if (props.separator$ || props.itemSeparator$) {
        return formatValue(rv, {
          multiple: props.multiple,
          allPath: props.emitPath,
          separator: props.separator$,
          itemSeparator: props.itemSeparator$,
        });
      }

      return rv;
    };

    const handleChange = (v: any) => {
      if (props.formatValue$) {
        emit("update:modelValue", props.formatValue$(v, props));
        return;
      }
      const rv = convertValue(v);
      emit("update:modelValue", rv);
    };

    const invalidKeys = [...keys(proTreeSelectProps()), "modelValue", "data", "props"];
    return () => {
      return (
        <ElTreeSelect
          ref={originRef}
          {...omit(props, invalidKeys)}
          modelValue={modelValue.value}
          onUpdate:modelValue={(v: any) => handleChange(v)}
          data={data.value}
          props={fieldNames.value}
          v-slots={slots}
        />
      );
    };
  },
});
