import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ButtonProps, FormItem, FormItemProps, Button } from "ant-design-vue";
import { keys, omit, pick } from "lodash";

import { ProFormList as ProFormListOrigin, ProFormListProps as ProFormListPropsOrigin } from "@vue-start/pro";

const proFormListProps = () => ({
  addButtonText: { type: String, default: "添加一项" },
  addButtonProps: { type: Object as PropType<ButtonProps> },
  minusButtonText: { type: String, default: "删除" },
  minusButtonProps: { type: Object as PropType<ButtonProps> },
});

export type ProFormListProps = Partial<ExtractPropTypes<ReturnType<typeof proFormListProps>>> &
  ProFormListPropsOrigin &
  FormItemProps;

export const ProFormList = defineComponent<ProFormListProps>({
  props: {
    ...FormItem.props,
    ...ProFormListOrigin.props,
    ...proFormListProps(),
  },
  setup: (props, { slots }) => {
    const originKeys = keys(ProFormListOrigin.props);
    const invalidKeys = keys(proFormListProps());

    return () => {
      return (
        <FormItem {...omit(props, ...originKeys, ...invalidKeys)} name={props.name}>
          <ProFormListOrigin
            {...pick(props, originKeys)}
            name={props.name}
            v-slots={{
              itemMinus: () => <Button {...props.minusButtonProps}>{props.minusButtonText}</Button>,
              add: () => <Button {...props.addButtonProps}>{props.addButtonText}</Button>,
              ...slots,
            }}
          />
        </FormItem>
      );
    };
  },
});
