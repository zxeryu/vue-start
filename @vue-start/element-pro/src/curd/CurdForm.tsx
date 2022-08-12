import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ButtonProps, ProSchemaForm, ProSchemaFormProps, ProSubmitButton } from "../form";
import { get, omit } from "lodash";
import { ElButton } from "element-plus";
import { CurdAction, CurdAddAction, CurdCurrentMode, useProCurd, useProModule } from "@vue-start/pro";

/**
 * 添加 和 修改 时候的确定按钮
 */
export const OkButton = defineComponent<ButtonProps>({
  props: {
    ...ElButton.props,
  },
  setup: (props, { slots }) => {
    const { curdState } = useProCurd();

    return () => {
      return (
        <ProSubmitButton
          onClick={() => {
            curdState.addAction = CurdAddAction.NORMAL;
          }}
          {...(props as any)}
          loading={curdState.operateLoading}>
          {slots.default ? slots.default() : "确定"}
        </ProSubmitButton>
      );
    };
  },
});

/**
 * 添加 时候的 确定并继续添加按钮
 */
export const ContinueAddButton = defineComponent<ButtonProps>({
  props: {
    ...ElButton.props,
  },
  setup: (props, { slots }) => {
    const { curdState } = useProCurd();

    return () => {
      return (
        <ProSubmitButton
          onClick={() => {
            curdState.addAction = CurdAddAction.CONTINUE;
          }}
          {...(props as any)}
          loading={curdState.operateLoading}>
          {slots.default ? slots.default() : "确定并继续"}
        </ProSubmitButton>
      );
    };
  },
});

const proOperateButtonProps = () => ({
  //显示 确定并继续 按钮
  showContinueAdd: { type: Boolean, default: false },
  //
  okText: { type: String, default: "确定" },
  okButtonProps: { type: Object as PropType<ButtonProps> },
  //
  continueText: { type: String, default: "确定并继续" },
  continueButtonProps: { type: Object as PropType<ButtonProps> },
});

export type ProOperateButtonProps = Partial<ExtractPropTypes<ReturnType<typeof proOperateButtonProps>>>;

export const ProOperateButton = defineComponent<ProOperateButtonProps>({
  props: {
    ...(proOperateButtonProps() as any),
  },
  setup: (props, { slots }) => {
    const { curdState } = useProCurd();

    return () => {
      return (
        <div class={"pro-curd-form-operate"}>
          {slots.left?.()}

          <OkButton {...props.okButtonProps}>{props.okText}</OkButton>

          {slots.center?.()}

          {curdState.mode === CurdCurrentMode.ADD && props.showContinueAdd && (
            <ContinueAddButton {...props.continueButtonProps}>{props.continueText}</ContinueAddButton>
          )}

          {slots.right?.()}
        </div>
      );
    };
  },
});

const proCurdFormProps = () => ({
  //
  operateButtonProps: { type: Object as PropType<ProOperateButtonProps> },
});

export type ProCurdFormProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdFormProps>>> & ProSchemaFormProps;

export const ProCurdForm = defineComponent<ProCurdFormProps>({
  props: {
    ...ProSchemaForm.props,
    ...proCurdFormProps(),
  },
  setup: (props, { slots }) => {
    const { elementMap, formElementMap } = useProModule();
    const { curdState, formColumns, sendCurdEvent } = useProCurd();

    const handleFinish = (values: Record<string, any>) => {
      if (curdState.mode === CurdCurrentMode.EDIT) {
        //edit
        sendCurdEvent({ action: CurdAction.EDIT, type: "execute", values });
      } else {
        //add
        sendCurdEvent({ action: CurdAction.ADD, type: "execute", values });
      }
    };

    return () => {
      return (
        <ProSchemaForm
          elementMap={elementMap}
          formElementMap={formElementMap}
          {...(props as any)}
          columns={formColumns}
          model={curdState.detailData}
          readonly={curdState.mode === CurdCurrentMode.DETAIL}
          hideRequiredAsterisk={curdState.mode === CurdCurrentMode.DETAIL}
          onFinish={handleFinish}
          v-slots={omit(slots, "default")}>
          {curdState.mode !== CurdCurrentMode.DETAIL && (
            <ProOperateButton
              {...omit(props.operateButtonProps, "slots")}
              v-slots={get(props.operateButtonProps, "slots")}
            />
          )}
          {slots.default?.()}
        </ProSchemaForm>
      );
    };
  },
});

export const ProCurdFormConnect = defineComponent({
  setup: () => {
    const { formProps } = useProCurd();
    return () => {
      return <ProCurdForm {...omit(formProps, "slots")} v-slots={get(formProps, "slots")} />;
    };
  },
});
