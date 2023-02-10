import { computed, defineComponent, ExtractPropTypes, ref } from "vue";
import { FormAction, ProForm, ProFormProps } from "../../comp";
import { CurdAction, CurdAddAction, CurdSubAction, useProCurd } from "../ctx";
import { createExpose } from "../../util";
import { get, omit } from "lodash";

const proCurdFormProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-curd-form" },
  //标记名称 对应columns中的配置名称
  signName: { type: String },
});

export type ProCurdFormProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdFormProps>>> & ProFormProps;

export const ProCurdForm = defineComponent<ProCurdFormProps>({
  props: {
    ...ProForm.props,
    ...proCurdFormProps(),
  },
  setup: (props, { slots, expose, attrs }) => {
    const { elementMap, formElementMap, curdState, formColumns, getSignColumns, sendCurdEvent } = useProCurd();

    const formRef = ref();
    expose(createExpose(props.formMethods || [], formRef));

    const columns = computed(() => {
      if (props.signName) {
        return getSignColumns(props.signName);
      }
      return formColumns.value;
    });

    const handleSubmit = () => {
      curdState.addAction = CurdAddAction.NORMAL;
      formRef.value?.submit();
    };

    const handleContinue = () => {
      curdState.addAction = CurdAddAction.CONTINUE;
      formRef.value?.submit();
    };

    const defaultOpeItems = [
      { value: FormAction.RESET, label: "重置" },
      { value: FormAction.SUBMIT, label: "提交", extraProps: { type: "primary" } },
      //默认不展示
      { value: FormAction.CONTINUE, label: "确定并继续", extraProps: { type: "primary" }, show: false },
    ];

    const handleFinish = (values: Record<string, any>) => {
      if (attrs.onFinish) {
        return;
      }
      if (curdState.mode === CurdAction.EDIT) {
        sendCurdEvent({ action: CurdAction.EDIT, type: CurdSubAction.EXECUTE, values });
      } else {
        sendCurdEvent({ action: CurdAction.ADD, type: CurdSubAction.EXECUTE, values });
      }
    };

    return () => {
      return (
        <ProForm
          ref={formRef}
          {...omit(props, "operate")}
          elementMap={props.elementMap || elementMap}
          formElementMap={props.formElementMap || formElementMap}
          columns={props.columns || columns.value}
          readonly={curdState.mode === CurdAction.DETAIL}
          // @ts-ignore ant-design-vue
          hideRequiredMark={curdState.mode === CurdAction.DETAIL}
          // element-plus
          hideRequiredAsterisk={curdState.mode === CurdAction.DETAIL}
          operate={{
            items: defaultOpeItems,
            onSubmit: handleSubmit,
            onContinue: handleContinue,
            ...props.operate,
          }}
          // @ts-ignore
          onFinish={handleFinish}
          v-slots={slots}
        />
      );
    };
  },
});

export const ProCurdFormConnect = defineComponent(() => {
  const { formProps } = useProCurd();
  return () => {
    return <ProCurdForm {...omit(formProps?.value, "slots")} v-slots={get(formProps?.value, "slots")} />;
  };
});
