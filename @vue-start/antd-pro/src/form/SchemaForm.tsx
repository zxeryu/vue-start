import { computed, defineComponent, ExtractPropTypes, PropType } from "vue";
import { ProForm, ProFormProps } from "./Form";
import { TColumns } from "../../types";
import { keys, map, omit, size } from "lodash";
import { getFormItemEl } from "../core";

const proSchemaFormProps = () => ({
  columns: { type: Array as PropType<TColumns> },
  /**
   * 录入控件集合，通过column->valueType 查找对应的录入组件
   */
  formElementMap: { type: Object as PropType<{ [key: string]: any }> },
  /**
   * 是否启用rules验证
   */
  needRules: { type: Boolean, default: true },
});

export type ProSchemaFormProps = Partial<ExtractPropTypes<ReturnType<typeof proSchemaFormProps>>> & ProFormProps;

export const ProSchemaForm = defineComponent<ProSchemaFormProps>({
  name: "PSchemaForm",
  props: {
    ...ProForm.props,
    ...proSchemaFormProps(),
  },
  setup: (props, { slots, expose }) => {
    const formItemList = computed(() => {
      if (!props.formElementMap || size(props.formElementMap) <= 0) {
        return null;
      }
      return map(props.columns, (item) => getFormItemEl(props.formElementMap, item, props.needRules));
    });

    const invalidKeys = keys(proSchemaFormProps());

    return () => {
      return (
        <ProForm ref={(el: any) => expose(el)} {...omit(props, invalidKeys)}>
          {formItemList.value}
          {slots.default?.()}
        </ProForm>
      );
    };
  },
});
