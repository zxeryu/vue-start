import { computed, defineComponent, PropType } from "vue";
import { ProTypographyProps, ProTypography } from "./Typography";
import { get, isArray, isNumber, join, map, omit } from "lodash";
import { TOptions } from "../types";
import { decimalFixed, listToMap, TConvert, thousandDivision, treeToMap } from "@vue-start/hooks";

const baseProps = {
  value: { type: [String, Number] },
  showProps: { type: Object as PropType<ProTypographyProps> },
  convert: { type: Function as PropType<TConvert> },
};

export const ProShowText = defineComponent({
  props: {
    ...baseProps,
  },
  setup: (props) => {
    const v = computed(() => {
      const content = props.showProps?.content;
      const v = props.value || isNumber(props.value) ? props.value : content;
      return props.convert ? props.convert(v, props) : v;
    });

    return () => {
      return <ProTypography {...omit(props.showProps, "content")} content={v.value} />;
    };
  },
});

export const ProShowDigit = defineComponent({
  props: {
    ...baseProps,
    //保留小数位
    decimalFixed: { type: Number, default: 0 },
    //千分位处理
    thousandDivision: { type: Boolean, default: false },
  },
  setup: (props) => {
    const v = computed(() => {
      let v = props.value;
      if (v && props.decimalFixed) {
        v = decimalFixed(v, props.decimalFixed || 2);
      }
      if (v && props.thousandDivision) {
        v = thousandDivision(v);
      }
      return props.convert ? props.convert(v, props) : v;
    });

    return () => {
      return <ProShowText value={v.value} showProps={props.showProps} />;
    };
  },
});

// select radio-group checkbox-group
export const ProShowOptions = defineComponent({
  props: {
    ...baseProps,
    value: { type: [String, Number, Array] },
    options: Array as PropType<TOptions>,
    splitStr: { type: String, default: "," },
  },
  setup: (props) => {
    const optionsMap = computed(() => listToMap(props.options!, (item) => item.label), undefined);

    const v = computed(() => {
      const value = props.value;
      let v = props.value;
      if (isArray(value)) {
        v = join(
          map(value, (item) => get(optionsMap.value, item, item)),
          props.splitStr,
        );
      } else {
        v = get(optionsMap.value, value!, props.value);
      }
      return props.convert ? props.convert(v, props) : v;
    });

    return () => {
      return <ProShowText value={v.value} showProps={props.showProps} />;
    };
  },
});

// tree cascader
export const ProShowTree = defineComponent({
  props: {
    ...baseProps,
    value: { type: [String, Number, Array] },
    splitStr: { type: String, default: "/" },
    //
    treeData: Array as PropType<Record<string, any>>, //ant
    data: Array as PropType<Record<string, any>>, //el
    options: Array as PropType<Record<string, any>>, //ant、el cascader
    //
    fieldNames: Object, //ant
    props: Object, //el
  },
  setup: (props) => {
    const optionsMap = computed(() => {
      const data = props.treeData || props.data || props.options;
      const fieldNames = props.fieldNames || props.props;
      return treeToMap(data as any, (item) => get(item, fieldNames?.label || "label"), {
        value: "value",
        children: "children",
        ...fieldNames,
      });
    });

    const v = computed(() => {
      let v = props.value;
      if (isArray(props.value)) {
        v = join(
          map(props.value, (item) => get(optionsMap.value, item, item)),
          props.splitStr,
        );
      } else {
        v = get(optionsMap.value, props.value!, props.value);
      }
      return props.convert ? props.convert(v, props) : v;
    });

    return () => {
      return <ProShowText value={v.value} showProps={props.showProps} />;
    };
  },
});
