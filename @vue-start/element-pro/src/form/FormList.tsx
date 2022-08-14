import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ButtonProps, ElButton } from "element-plus";
import { keys, omit, pick } from "lodash";
import { ProFormItem, ProFormItemProps } from "./Form";
import { ProFormList as ProFormListOrigin, ProFormListProps as ProFormListPropsOrigin } from "@vue-start/pro";

const proFormListProps = () => ({
  addButtonText: { type: String, default: "添加一项" },
  addButtonProps: { type: Object as PropType<ButtonProps> },
  minusButtonText: { type: String, default: "删除" },
  minusButtonProps: { type: Object as PropType<ButtonProps> },
});

export type ProFormListProps = Partial<ExtractPropTypes<ReturnType<typeof proFormListProps>>> &
  ProFormListPropsOrigin &
  ProFormItemProps;

export const ProFormList = defineComponent<ProFormListProps>({
  name: "PFormList",
  props: {
    ...ProFormItem.props,
    ...proFormListProps(),
  },
  setup: (props, { slots }) => {
    const originKeys = keys(ProFormListOrigin.props);
    const invalidKeys = keys(proFormListProps());

    return () => {
      return (
        <ProFormItem {...(omit(props, ...originKeys, ...invalidKeys) as any)} name={props.name}>
          <ProFormListOrigin
            {...pick(props, originKeys)}
            name={props.name}
            v-slots={{
              itemMinus: () => {
                return (
                  <ElButton link {...props.minusButtonProps}>
                    {props.minusButtonText}
                  </ElButton>
                );
              },
              add: () => {
                return (
                  <ElButton type={"primary"} {...props.addButtonProps}>
                    {props.addButtonText}
                  </ElButton>
                );
              },
              ...slots,
            }}
          />
        </ProFormItem>
      );
    };
  },
});
