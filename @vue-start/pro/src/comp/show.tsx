import { computed, defineComponent, PropType } from "vue";
import { ProTypographyProps, ProTypography } from "./Typography";
import { get, isArray, isNumber, join, map, omit, pick } from "lodash";
import { TOptions } from "../types";
import { decimalFixed, listToMap, TConvert, thousandDivision, treeToMap } from "@vue-start/hooks";
import dayjs from "dayjs";

const baseProps = {
  value: { type: [String, Number] },
  showProps: { type: Object as PropType<ProTypographyProps> },
  convert: { type: Function as PropType<TConvert> },
  //重写dom
  render: { type: Function, default: undefined },
};

export const ProShowText = defineComponent({
  inheritAttrs: false,
  props: {
    ...baseProps,
  },
  setup: (props, { attrs }) => {
    const v = computed(() => {
      const content = props.showProps?.content;
      const v = props.value || isNumber(props.value) ? props.value : content;
      return props.convert ? props.convert(v, props) : v;
    });

    return () => {
      return (
        <ProTypography {...pick(attrs, "style", "class")} {...omit(props.showProps, "content")} content={v.value} />
      );
    };
  },
});

export const ProShowDigit = defineComponent({
  inheritAttrs: false,
  props: {
    ...baseProps,
    //保留小数位
    decimalFixed: { type: Number, default: 0 },
    //千分位处理
    thousandDivision: { type: Boolean, default: false },
  },
  setup: (props, { attrs }) => {
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
      if (props.render) {
        return props.render({ value: v.value, props });
      }
      return (
        <ProShowText
          // @ts-ignore
          class={"pro-show-digit"}
          {...pick(attrs, "style", "class")}
          value={v.value}
          showProps={props.showProps}
        />
      );
    };
  },
});

// select radio-group checkbox-group
export const ProShowOptions = defineComponent({
  inheritAttrs: false,
  props: {
    ...baseProps,
    value: { type: [String, Number, Array] },
    options: Array as PropType<TOptions>,
    splitStr: { type: String, default: "," },
    //颜色 单个值生效
    colorMap: { type: Object },
  },
  setup: (props, { attrs }) => {
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

    const color = computed(() => {
      return get(props.colorMap, props.value as string);
    });

    return () => {
      if (props.render) {
        return props.render({ color: color.value, value: v.value, props });
      }
      return (
        <ProShowText
          // @ts-ignore
          class={"pro-show-options"}
          {...pick(attrs, "style", "class")}
          style={`color:${color.value || ""}`}
          value={v.value}
          showProps={props.showProps}
        />
      );
    };
  },
});

// tree cascader
export const ProShowTree = defineComponent({
  inheritAttrs: false,
  props: {
    ...baseProps,
    value: { type: [String, Number, Array] },
    splitStr: { type: String, default: "/" },
    splitStr2: { type: String, default: "," }, //多选的情况
    //
    treeData: Array as PropType<Record<string, any>>, //ant
    data: Array as PropType<Record<string, any>>, //el
    options: Array as PropType<Record<string, any>>, //ant、el cascader
    //
    fieldNames: Object, //ant
    props: Object, //el
    //
    multiple: { type: Boolean },
  },
  setup: (props, { attrs }) => {
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
          props.multiple ? props.splitStr2 : props.splitStr,
        );
      } else {
        v = get(optionsMap.value, props.value!, props.value);
      }
      return props.convert ? props.convert(v, props) : v;
    });

    return () => {
      if (props.render) {
        return props.render({ value: v.value, props });
      }
      return (
        <ProShowText
          // @ts-ignore
          class={"pro-show-tree"}
          {...pick(attrs, "style", "class")}
          value={v.value}
          showProps={props.showProps}
        />
      );
    };
  },
});

export const ProShowDate = defineComponent({
  props: {
    ...baseProps,
    value: { type: [String, Number, Array] },
    splitStr: { type: String, default: "-" },
    format: { type: String, default: "YYYY-MM-DD" },
    isUnix: { type: Boolean, default: false },
  },
  setup: (props, { attrs }) => {
    const formatDate = (date: number | string) => {
      if (!date) return date;
      if (props.isUnix) {
        return dayjs.unix(date as number).format(props.format);
      }
      return dayjs(date).format(props.format);
    };

    const v = computed(() => {
      let v = props.value;
      if (isArray(props.value)) {
        v = join(
          map(props.value, (item) => formatDate(item) || ""),
          props.splitStr,
        );
      } else {
        v = formatDate(props.value!) || "";
      }
      return props.convert ? props.convert(v, props) : v;
    });

    return () => {
      if (props.render) {
        return props.render({ value: v.value, props });
      }
      return (
        <ProShowText
          // @ts-ignore
          class={"pro-show-date"}
          {...pick(attrs, "style", "class")}
          value={v.value}
          showProps={props.showProps}
        />
      );
    };
  },
});
