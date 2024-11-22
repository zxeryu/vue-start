import { computed, defineComponent, ExtractPropTypes, ref } from "vue";
import { DialogProps, ElDialog, DrawerProps, ElDrawer } from "element-plus";
import { isBoolean, keys, omit } from "lodash";
import { createExposeObj, ElementKeys, useGetCompByKey } from "@vue-start/pro";

const proModalProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-modal" },
  visible: { type: Boolean, default: false },
  cancelText: { type: String, default: "取消" },
  okText: { type: String, default: "确认" },
  confirmLoading: Boolean,
  footer: { type: Boolean, default: true },
  //兼容ant-v
  maskClosable: { type: [Object, Boolean], default: undefined },
  //
  scrollProps: { type: Object },
});

export type ProModalProps = Partial<ExtractPropTypes<ReturnType<typeof proModalProps>>> & DialogProps;

export const ProModal = defineComponent<ProModalProps>({
  props: {
    ...ElDialog.props,
    //覆盖原始值，默认true
    appendToBody: { type: Boolean, default: true },
    destroyOnClose: { type: Boolean, default: true },
    ...proModalProps(),
  },
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef));

    const handleUpdate = (v: boolean) => {
      emit("update:modelValue", v);
      emit("update:visible", v);
      if(!v){
        emit("cancel");
      }
    };

    const handleCancel = () => {
      handleUpdate(false);
    };

    const handleOk = () => {
      emit("ok");
    };

    const getComp = useGetCompByKey();
    const Operate = getComp(ElementKeys.ProOperateKey);
    const Scroll = getComp(ElementKeys.ScrollKey);

    const items = computed(() => {
      return [
        { value: "cancel", label: props.cancelText, onClick: handleCancel },
        {
          value: "ok",
          label: props.okText,
          loading: props.confirmLoading,
          extraProps: { type: "primary" },
          onClick: handleOk,
        },
      ];
    });

    const invalidKeys = keys(proModalProps());

    return () => {
      return (
        <ElDialog
          class={props.clsName}
          ref={originRef}
          {...omit(props, ...invalidKeys)}
          closeOnClickModal={isBoolean(props.maskClosable) ? props.maskClosable : props.closeOnClickModal}
          modelValue={props.visible || props.modelValue}
          onUpdate:modelValue={handleUpdate}
          v-slots={{
            footer: props.footer === false ? undefined : () => <Operate items={items.value} />,
            ...slots,
            default: () => (
              <Scroll class={`${props.clsName}-scroll`} {...props.scrollProps}>
                {slots.default?.()}
              </Scroll>
            ),
          }}
        />
      );
    };
  },
});

const proDrawerProps = () => ({
  clsName: { type: String, default: "pro-drawer" },
  visible: { type: Boolean, default: false },
  cancelText: { type: String, default: "取消" },
  okText: { type: String, default: "确认" },
  footer: { type: Boolean, default: true },
  confirmLoading: Boolean,
  //
  scrollProps: { type: Object },
});

export type ProDrawerProps = Partial<ExtractPropTypes<ReturnType<typeof proDrawerProps>>> & DrawerProps;

export const ProDrawer = defineComponent<ProDrawerProps>({
  props: {
    ...ElDrawer.props,
    ...proDrawerProps(),
    appendToBody: { type: Boolean, default: true },
    destroyOnClose: { type: Boolean, default: true },
  },
  setup: (props, { slots, emit, expose }) => {
    const originRef = ref();

    expose(createExposeObj(originRef));

    const handleUpdate = (v: boolean) => {
      emit("update:modelValue", v);
      emit("update:visible", v);
      if(!v){
        emit("cancel");
      }
    };

    const handleCancel = () => {
      handleUpdate(false);
    };

    const handleOk = () => {
      emit("ok");
    };

    const getComp = useGetCompByKey();
    const Operate = getComp(ElementKeys.ProOperateKey);
    const Scroll = getComp(ElementKeys.ScrollKey);

    const items = computed(() => {
      return [
        { value: "cancel", label: props.cancelText, onClick: handleCancel },
        {
          value: "ok",
          label: props.okText,
          loading: props.confirmLoading,
          extraProps: { type: "primary" },
          onClick: handleOk,
        },
      ];
    });

    const invalidKeys = keys(proModalProps());

    return () => {
      return (
        <ElDrawer
          class={props.clsName}
          ref={originRef}
          {...omit(props, invalidKeys)}
          modelValue={props.visible || props.modelValue}
          onUpdate:modelValue={handleUpdate}
          v-slots={{
            footer: props.footer === false ? undefined : () => <Operate items={items.value} />,
            ...slots,
            default: () => (
              <Scroll class={`${props.clsName}-scroll`} {...props.scrollProps}>
                {slots.default?.()}
              </Scroll>
            ),
          }}
        />
      );
    };
  },
});
