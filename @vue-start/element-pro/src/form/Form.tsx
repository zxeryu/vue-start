import { defineComponent, ExtractPropTypes, PropType, reactive, ref, toRaw } from "vue";
import { ElForm, FormInstance, ElFormItem, FormItemProps } from "element-plus";
import { keys, omit, pick } from "lodash";
import { FormItemRule } from "element-plus/es/tokens/form";
import {
  getValidValues,
  ProForm as ProFormOrigin,
  ProFormProps as ProFormPropsOrigin,
  useProForm,
} from "@vue-start/pro";

const proFormItemProps = () => ({
  name: { type: [String, Array] as PropType<string | (string | number)[]> },
});

export type ProFormItemProps = Partial<ExtractPropTypes<ReturnType<typeof proFormItemProps>>> & FormItemProps;

export const ProFormItem = defineComponent<ProFormItemProps>({
  props: {
    ...ElFormItem.props,
    ...proFormItemProps(),
  },
  setup: (props, { slots }) => {
    const invalidKeys = keys(proFormItemProps());

    return () => {
      return (
        <ElFormItem
          {...omit(props, ...invalidKeys, "name", "prop")}
          prop={props.prop || (props.name as any)}
          v-slots={slots}
        />
      );
    };
  },
});

interface FormProps {
  model?: Record<string, any>;
  rules?: FormItemRule[];
  labelPosition?: "left" | "right" | "top";
  labelWidth?: string | number;
  labelSuffix?: string;
  inline?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  showMessage?: boolean;
  size?: "large" | "default" | "small";
  disabled?: boolean;
  validateOnRuleChange?: boolean;
  hideRequiredAsterisk?: boolean;
  scrollToError?: boolean;
}

export type ProFormProps = ProFormPropsOrigin &
  FormProps & {
    onFinish?: (showValues: Record<string, any>, values: Record<string, any>) => void;
    onFinishFailed?: (invalidFields: Record<string, any>) => void;
  }; //emit;

const Content = defineComponent(() => {
  const { formItemVNodes } = useProForm();
  return () => {
    return formItemVNodes.value;
  };
});

export const ProForm = defineComponent<ProFormProps>({
  inheritAttrs: false,
  props: {
    ...ElForm.props,
    ...omit(ProFormOrigin.props, "model"),
  },
  setup: (props, { slots, expose, emit, attrs }) => {
    const formRef = ref();

    const formState = props.model || reactive({});
    const showState = props.showState || reactive({});

    const handleRef = (el: FormInstance) => {
      const nexEl = {
        ...el,
        submit: () => {
          el.validate?.((isValid, invalidFields) => {
            if (isValid) {
              //验证成功
              //删除不显示的值再触发事件
              const showValues = getValidValues(formState, showState, props.showStateRules);
              emit("finish", showValues, toRaw(formState));
            } else {
              emit("finishFailed", invalidFields);
            }
          });
        },
      };
      expose(nexEl);
      formRef.value = nexEl;
    };

    const originKeys = keys(omit(ProFormOrigin.props, "model"));

    return () => {
      return (
        <ProFormOrigin
          {...pick(props, ...originKeys, "provideExtra")}
          model={formState}
          showState={showState}
          provideExtra={{ formRef, ...props.provideExtra }}>
          <ElForm ref={handleRef as any} {...attrs} {...omit(props, ...originKeys, "model")} model={formState}>
            <Content />
            {slots.default?.()}
          </ElForm>
        </ProFormOrigin>
      );
    };
  },
});
