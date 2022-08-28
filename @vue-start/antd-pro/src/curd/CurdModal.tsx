import { defineComponent } from "vue";
import { Modal, ModalProps, Spin } from "ant-design-vue";
import { get, omit } from "lodash";
import { ProCurdFormConnect } from "./CurdForm";
import { setReactiveValue } from "@vue-start/hooks";
import { CurdAction, CurdCurrentMode, useProCurd } from "@vue-start/pro";

export const ProCurdModal = defineComponent<ModalProps>({
  props: {
    ...Modal.props,
  },
  setup: (props, { slots }) => {
    const { curdState, getOperate } = useProCurd();

    //根据当前模式展示不同的Title
    const getTitle = () => {
      switch (curdState.mode) {
        case CurdCurrentMode.ADD:
          return getOperate(CurdAction.ADD)?.label;
        case CurdCurrentMode.EDIT:
          return getOperate(CurdAction.EDIT)?.label;
        case CurdCurrentMode.DETAIL:
          return getOperate(CurdAction.DETAIL)?.label;
      }
    };

    const handleCancel = () => {
      curdState.mode = undefined;

      setReactiveValue(curdState.detailData, {});
      curdState.detailLoading = false;
    };

    return () => {
      return (
        <Modal
          destroyOnClose
          footer={null}
          title={getTitle()}
          //如果当前有操作模式，打开Modal
          visible={!!curdState.mode}
          onCancel={handleCancel}
          {...(props as any)}
          v-slots={omit(slots, "default")}>
          {curdState.detailLoading ? (
            <div class={"pro-curd-modal-spin"}>
              <Spin spinning />
            </div>
          ) : (
            slots.default?.()
          )}
        </Modal>
      );
    };
  },
});

export const ProCurdModalConnect = defineComponent({
  setup: () => {
    const { modalProps } = useProCurd();

    return () => {
      return (
        <ProCurdModal {...omit(modalProps?.value, "slots")} v-slots={get(modalProps?.value, "slots")}>
          <ProCurdFormConnect />
        </ProCurdModal>
      );
    };
  },
});
