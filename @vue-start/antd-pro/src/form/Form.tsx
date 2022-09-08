import { DefineComponent, defineComponent, ref } from "vue";
import { Form as FormOrigin, FormProps } from "ant-design-vue";

import {
  createExpose,
  createForm,
  createSearchForm,
  ProFormProps as ProFormPropsOrigin,
  ProSearchFormProps as ProSearchFormPropsOrigin,
} from "@vue-start/pro";
import { ProGrid, ProGridProps } from "../comp";
import { useEffect } from "@vue-start/hooks";

export const FormMethods = [
  "clearValidate",
  "getFieldsValue",
  "resetFields",
  "scrollToField",
  "validate",
  "validateFields",
  "submit",
];

const Form = defineComponent({
  props: {
    ...FormOrigin.props,
  },
  setup: (props, { slots, emit, expose }) => {
    const formRef = ref();

    useEffect(() => {
      if (!formRef.value) {
        return;
      }
      formRef.value.submit = () => {
        formRef.value.validate().then((values: Record<string, any>) => {
          emit("finish", values);
        });
      };
    }, []);

    expose(createExpose(FormMethods, formRef));

    return () => {
      return <FormOrigin ref={formRef} {...props} v-slots={slots} />;
    };
  },
});

export type ProFormProps = ProFormPropsOrigin & FormProps & Omit<ProGridProps, "items">;

export const ProForm: DefineComponent<ProFormProps> = createForm(Form, ProGrid, FormMethods);

export type ProSearchFormProps = ProSearchFormPropsOrigin & ProFormProps;

export const ProSearchForm: DefineComponent<ProSearchFormProps> = createSearchForm(
  ProForm,
  {
    //覆盖props描述
    layout: { type: String, default: "inline" },
    needRules: { type: Boolean, default: false },
  },
  FormMethods,
);
