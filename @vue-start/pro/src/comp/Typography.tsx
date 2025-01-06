import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ElementKeys, useGetCompByKey } from "./comp";
import { isNumber } from "lodash";

/**
 * 展示值，主要规避掉 0 的情况
 * @param v
 * @param emptyText
 */
export const showValue = (v: string | number, emptyText?: string) => {
  //主要是屏蔽掉 0 的情况
  if (isNumber(v)) {
    return v;
  }
  return v || emptyText;
};

const valueProps = () => ({
  value: { type: [String, Number] },
  emptyText: { type: String },
});

/**
 * 展示值组件
 */
export const ProValue = defineComponent({
  props: {
    ...valueProps(),
  },
  setup: (props) => {
    return () => {
      return showValue(props.value!, props.emptyText);
    };
  },
});

const typographyProps = () => ({
  content: { type: [String, Number] },
  ellipsis: { type: [Object as PropType<{ rows?: number; num?: number }>, Boolean] },
  popoverProps: Object,
  //
  emptyText: { type: String },
});

export type ProTypographyProps = Partial<ExtractPropTypes<ReturnType<typeof typographyProps>>>;

export const ProTypography = defineComponent<ProTypographyProps>({
  inheritAttrs: false,
  props: {
    ...typographyProps(),
  } as any,
  setup: (props, { attrs }) => {
    const getComp = useGetCompByKey();

    const Popover = getComp(ElementKeys.PopoverKey);

    const getClamp = () => {
      if (!props.ellipsis) return "unset";
      if (props.ellipsis === true) return 1;
      return props.ellipsis?.rows || props.ellipsis?.num || 1;
    };

    return () => {
      const dom = (
        <span
          class={`pro-typography ${props.ellipsis ? "pro-typography-ellipsis" : ""}`}
          style={`-webkit-line-clamp:${getClamp()}`}
          {...attrs}>
          {showValue(props.content!, props.emptyText)}
        </span>
      );

      if (!props.popoverProps || !Popover) return dom;

      return (
        <Popover {...props.popoverProps} v-slots={{ content: () => props.content }}>
          {dom}
        </Popover>
      );
    };
  },
});
