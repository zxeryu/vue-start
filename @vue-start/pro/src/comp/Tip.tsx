import { defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { ElementKeys, useGetCompByKey } from "./comp";
import { omit } from "lodash";

const proTip = () => ({
  title: String, //ant-design-vue
  content: String, //element-plus
  //render dom
  renderDom: { type: Function as PropType<() => VNode>, default: () => <span class={"pro-tip-dom"}>?</span> },
});

export type ProTipProps = Partial<ExtractPropTypes<ReturnType<typeof proTip>>>;

export const ProTip = defineComponent<ProTipProps>({
  props: {
    ...proTip(),
  } as any,
  setup: (props, { slots }) => {
    const getComp = useGetCompByKey();
    const Tooltip = getComp(ElementKeys.TooltipKey);
    return () => {
      return (
        <Tooltip
          {...omit(props, "renderDom")}
          v-slots={{
            content: () => props.content,
            title: () => props.title,
            ...slots,
          }}>
          {slots.default?.() || props.renderDom?.()}
        </Tooltip>
      );
    };
  },
});
