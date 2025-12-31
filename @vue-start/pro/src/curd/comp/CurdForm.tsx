import { computed, defineComponent, ExtractPropTypes, ref } from "vue";
import { ElementKeys, FormAction, ProFormProps, useGetCompByKey } from "../../comp";
import { CurdAction, CurdAddAction, CurdSubAction, useProCurd } from "../ctx";
import { createExpose } from "../../util";
import { get, omit } from "lodash";
import { useProConfig } from "../../core";

const proCurdFormProps = () => ({
  //标记名称 对应columns中的配置名称
  signName: { type: String },
});

export type ProCurdFormProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdFormProps>>> & ProFormProps;

export const ProCurdForm = defineComponent<ProCurdFormProps>({
  props: {
    ...proCurdFormProps(),
  } as any,
  setup: (props, { slots, expose, attrs }) => {
    const { t } = useProConfig();
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

    const defaultOpeItems = computed(() => {
      return [
        { value: FormAction.RESET, label: t.value("reset") },
        { value: FormAction.SUBMIT, label: t.value("submit"), extraProps: { type: "primary" } },
        //默认不展示
        {
          value: FormAction.CONTINUE,
          label: t.value("confirmAndContinue"),
          extraProps: { type: "primary" },
          show: false,
        },
      ];
    });

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

    const getComp = useGetCompByKey();
    const Form = getComp(ElementKeys.ProFormKey);

    return () => {
      if (!Form) return null;
      return (
        <Form
          ref={formRef}
          class={"pro-curd-form"}
          {...omit(props, "operate")}
          elementMap={props.elementMap || elementMap}
          formElementMap={props.formElementMap || formElementMap}
          columns={props.columns || columns.value}
          readonly={curdState.mode === CurdAction.DETAIL}
          model={props.model || curdState.detailData}
          hideRequiredMark={curdState.mode === CurdAction.DETAIL}
          operate={
            props.operate
              ? {
                  items: defaultOpeItems.value,
                  onSubmit: handleSubmit,
                  onContinue: handleContinue,
                  ...props.operate,
                }
              : undefined
          }
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
