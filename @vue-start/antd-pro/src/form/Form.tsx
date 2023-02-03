import { defineComponent, ref } from "vue";
import { Form as FormOrigin } from "ant-design-vue";

import { createExpose } from "@vue-start/pro";
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

export const Form = defineComponent({
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
