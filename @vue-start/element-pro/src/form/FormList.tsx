import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ButtonProps, ElButton } from "element-plus";
import { keys, omit } from "lodash";
import { ProFormItem, ProFormItemProps } from "./Form";
import { createFormList, ProFormListProps as ProFormListPropsOrigin } from "@vue-start/pro";

const FormList = createFormList(ProFormItem);

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
            itemMinus: () => <ElButton {...props.minusButtonProps}>{props.minusButtonText}</ElButton>,
            add: () => <ElButton {...props.addButtonProps}>{props.addButtonText}</ElButton>,
            ...slots,
          }}
        />
      );
    };
  },
});
