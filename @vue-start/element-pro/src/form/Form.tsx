import { DefineComponent, defineComponent, ExtractPropTypes, PropType, reactive, ref, toRaw } from "vue";
import { ElForm, FormInstance, ElFormItem, FormItemProps } from "element-plus";
import { keys, omit } from "lodash";
import { FormItemRule } from "element-plus/es/tokens/form";
import {
  createExpose,
  createForm,
  createSearchForm,
  ProFormProps as ProFormPropsOrigin,
  ProSearchFormProps as ProSearchFormPropsOrigin,
} from "@vue-start/pro";
import { ProGrid, ProGridProps } from "../comp";
import { useEffect } from "@vue-start/hooks";

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

export const FormMethods = ["clearValidate", "resetFields", "scrollToField", "validate", "validateField", "submit"];

const Form = defineComponent({
  props: {
    ...ElForm.props,
  },
  setup: (props, { slots, emit, expose }) => {
    const formState = props.model || reactive({});
    const formRef = ref<FormInstance & { submit: () => void }>();

    useEffect(() => {
      if (!formRef.value) {
        return;
      }
      formRef.value.submit = () => {
        formRef.value?.validate((isValid, invalidFields) => {
          if (isValid) {
            emit("finish", toRaw(formState));
          } else {
            emit("finishFailed", invalidFields);
          }
        });
      };
    }, []);

    expose(createExpose(FormMethods, formRef));

    return () => {
      return <ElForm ref={formRef} {...omit(props, "model")} model={formState} v-slots={slots} />;
    };
  },
});

export type ProFormProps = ProFormPropsOrigin &
  FormProps &
  Omit<ProGridProps, "items"> & {
    onFinish?: (showValues: Record<string, any>, values: Record<string, any>) => void;
    onFinishFailed?: (invalidFields: Record<string, any>) => void;
  }; //emit;

export const ProForm: DefineComponent<ProFormProps> = createForm(Form, ProGrid, FormMethods);

export type ProSearchFormProps = ProSearchFormPropsOrigin & ProFormProps;

export const ProSearchForm: DefineComponent<ProSearchFormProps> = createSearchForm(
  ProForm,
  {
    needRules: { type: Boolean, default: false },
    inline: { type: Boolean, default: true },
  },
  FormMethods,
);
