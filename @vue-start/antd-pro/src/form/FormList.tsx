import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ButtonProps, FormItem, FormItemProps, Button } from "ant-design-vue";
import { keys, omit } from "lodash";
import { createFormList, ProFormListProps as ProFormListPropsOrigin } from "@vue-start/pro";

const FormList = createFormList(FormItem);

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
    ...FormList.props,
    ...proFormListProps(),
  },
  setup: (props, { slots }) => {
    const invalidKeys = keys(proFormListProps());

    return () => {
      return (
        <FormList
          {...omit(props, invalidKeys)}
          v-slots={{
            itemMinus: () => <Button {...props.minusButtonProps}>{props.minusButtonText}</Button>,
            add: () => <Button {...props.addButtonProps}>{props.addButtonText}</Button>,
            ...slots,
          }}
        />
      );
    };
  },
});
