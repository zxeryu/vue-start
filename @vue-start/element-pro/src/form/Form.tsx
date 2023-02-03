import { defineComponent, ExtractPropTypes, PropType, reactive, ref, toRaw } from "vue";
import { ElForm, FormInstance, ElFormItem, FormItemProps } from "element-plus";
import { keys, omit } from "lodash";
import { createExpose } from "@vue-start/pro";
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

export const FormMethods = ["clearValidate", "resetFields", "scrollToField", "validate", "validateField", "submit"];

export const Form = defineComponent({
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
