import { defineComponent, ExtractPropTypes, ref } from "vue";
import { ElementKeys, useGetCompByKey } from "../../comp";
import { CurdAction, useProCurd } from "../ctx";
import { get, keys, omit, some } from "lodash";
import { setReactiveValue } from "@vue-start/hooks";
import { ProCurdForm } from "./CurdForm";
import { filterSlotsByPrefix } from "../../util";

const proCurdModalProps = () => ({
  //只有指定mode才显示
  validMode: { type: Array, default: [CurdAction.ADD, CurdAction.DETAIL, CurdAction.EDIT] },
  //loading属性
  loadingOpts: { type: Object },
  //modal 属性
  overrideProps: { type: Object },
});

export type ProCurdModalProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdModalProps>>> & Record<string, any>;

export const ProCurdModal = defineComponent<ProCurdModalProps>({
  props: {
    ...proCurdModalProps(),
  } as any,
  setup: (props, { slots }) => {
    const getComp = useGetCompByKey();
    const Modal = getComp(ElementKeys.ModalKey);
    const Loading = getComp(ElementKeys.LoadingKey);

    const { curdState, getOperate } = useProCurd();

    const handleCancel = () => {
      curdState.mode = undefined;
      setReactiveValue(curdState.detailData, {});
      curdState.detailLoading = false;
      curdState.addAction = undefined;
    };

    const invalidKeys = keys(proCurdModalProps());

    return () => {
      const mode = curdState.mode;
      if (!some(props.validMode, (item) => item === mode)) {
        return null;
      }
      if (!Modal) {
        return null;
      }
      return (
        <Modal
          class={"pro-curd-modal"}
          {...omit(props, invalidKeys)}
          visible={some(props.validMode, (item) => item === mode)}
          title={props.title || getOperate(curdState.mode!)?.label}
          confirmLoading={curdState.operateLoading}
          maskClosable={curdState.mode === CurdAction.DETAIL}
          footer={curdState.mode === CurdAction.DETAIL ? false : undefined}
          {...props.overrideProps}
          onCancel={handleCancel}
          v-slots={omit(slots, "default")}>
          {curdState.detailLoading && Loading ? (
            <Loading loading {...props.loadingOpts}>
              <div class={`pro-curd-modal-loading-dom`} />
            </Loading>
          ) : (
            slots.default?.()
          )}
        </Modal>
      );
    };
  },
});

export const ProCurdModalForm = defineComponent({
  props: {
    modalProps: Object,
    formProps: Object,
  },
  setup: (props, { slots }) => {
    const formRef = ref();

    const modalSlots = filterSlotsByPrefix(slots, "modal");
    const formSlots = filterSlotsByPrefix(slots, "form");

    return () => {
      return (
        <ProCurdModal
          {...props.modalProps}
          onOk={() => {
            formRef.value?.submit();
          }}
          v-slots={modalSlots}>
          <ProCurdForm ref={formRef} {...props.formProps} v-slots={formSlots} />
        </ProCurdModal>
      );
    };
  },
});

export const ProCurdModalFormConnect = defineComponent(() => {
  const { modalProps, formProps } = useProCurd();

  const formRef = ref();

  return () => {
    return (
      <ProCurdModal
        {...omit(modalProps?.value, "slots")}
        onOk={() => {
          formRef.value?.submit();
        }}
        v-slots={get(modalProps?.value, "slots")}>
        <ProCurdForm ref={formRef} {...omit(formProps?.value, "slots")} v-slots={get(formProps?.value, "slots")} />
      </ProCurdModal>
    );
  };
});
