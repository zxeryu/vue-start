import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
import { DialogProps, ElDialog, ElButton, ButtonProps } from "element-plus";
import { keys, omit } from "lodash";
import { useWatch } from "@vue-start/hooks";

const proModalProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-modal" },
  visible: { type: Boolean, default: false },
  cancelText: { type: String, default: "取消" },
  cancelButtonProps: { type: Object as PropType<ButtonProps & { onClick?: () => void }> },
  okText: { type: String, default: "确认" },
  okButtonProps: { type: Object as PropType<ButtonProps & { onClick?: () => void }> },
  confirmLoading: Boolean,
  footer: Boolean,
});

export type ProModalProps = Partial<ExtractPropTypes<ReturnType<typeof proModalProps>>> & DialogProps;

export const ProModal = defineComponent<ProModalProps>({
  props: {
    ...ElDialog.props,
    ...proModalProps(),
  },
  setup: (props, { slots, emit }) => {
    const visibleRef = ref(props.visible);

    useWatch(
      () => {
        visibleRef.value = props.visible;
      },
      () => props.visible,
    );

    const handleCancel = () => {
      if (props.cancelButtonProps?.onClick) {
        props.cancelButtonProps.onClick();
        return;
      }
      visibleRef.value = false;
      emit("update:visible", false);
    };
    const handleOk = () => {
      if (props.okButtonProps?.onClick) {
        props.okButtonProps.onClick();
        return;
      }
      emit("ok");
    };

    const invalidKeys = keys(proModalProps());

    return () => {
      return (
        <ElDialog
          class={props.clsName}
          {...omit(props, ...invalidKeys, "modelValue")}
          v-model:modelValue={visibleRef.value}
          onUpdate:modelValue={(v) => {
            emit("update:visible", v);
          }}
          onClose={() => {
            emit("cancel");
          }}
          v-slots={{
            footer:
              props.footer === false
                ? undefined
                : () => {
                    return (
                      <div class={`${props.clsName}-operate`}>
                        <ElButton {...omit(props.cancelButtonProps, "onClick")} onClick={handleCancel}>
                          {props.cancelText}
                        </ElButton>
                        <ElButton
                          type={"primary"}
                          loading={props.confirmLoading}
                          {...(omit(props.okButtonProps, "onClick") as any)}
                          onClick={handleOk}>
                          {props.okText}
                        </ElButton>
                      </div>
                    );
                  },
            ...slots,
          }}
        />
      );
    };
  },
});
