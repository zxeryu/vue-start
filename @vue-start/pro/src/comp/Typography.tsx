import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ElementKeys, useGetCompByKey } from "./comp";

const typographyProps = () => ({
  content: { type: [String, Number] },
  ellipsis: { type: [Object as PropType<{ rows?: number; num?: number }>, Boolean] },
  popoverProps: Object,
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
          {props.content}
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
