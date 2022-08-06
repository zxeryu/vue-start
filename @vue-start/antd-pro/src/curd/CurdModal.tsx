import { defineComponent } from "vue";
import { Modal, ModalProps, Spin } from "ant-design-vue";
import { useProCurdModule } from "./ctx";
import { CurdCurrentMode } from "./CurdModule";
import { get, omit } from "lodash";
import { ProCurdFormConnect } from "./CurdForm";
import { setReactiveValue } from "../../../hooks";

export const ProCurdModal = defineComponent<ModalProps>({
  props: {
    ...Modal.props,
  },
  setup: (props, { slots }) => {
    const { curdState, operate } = useProCurdModule();

    //根据当前模式展示不同的Title
    const getTitle = () => {
      switch (curdState.mode) {
        case CurdCurrentMode.ADD:
          return operate.addLabel;
        case CurdCurrentMode.EDIT:
          return operate.editLabel;
        case CurdCurrentMode.DETAIL:
          return operate.detailLabel;
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
          v-slots={omit(slots, "slots")}>
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
    const { modalProps } = useProCurdModule();

    return () => {
      return (
        <ProCurdModal {...omit(modalProps, "slots")} v-slots={get(modalProps, "slots")}>
          <ProCurdFormConnect />
        </ProCurdModal>
      );
    };
  },
});
