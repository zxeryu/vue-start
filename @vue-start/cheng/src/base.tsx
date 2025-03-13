import { defineComponent } from "vue";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";
import { omit } from "lodash";

export const ChengModal = defineComponent({
  props: {
    modalProps: Object,
    title: String,
    visible: Boolean,
  } as any,
  setup: (props, { slots }) => {
    const getComp = useGetCompByKey();
    const Modal = getComp(ElementKeys.ModalKey);

    return () => {
      if (!Modal) {
        return null;
      }

      return (
        <Modal
          draggable
          maskClosable={false}
          destroyOnClose
          appendToBody
          footer={false}
          {...omit(props, "modalProps")}
          {...props.modalProps}
          v-slots={{
            header: () => (
              <div class={"cheng-modal-header"}>
                <div class={"title"}>{props.modalProps?.title || props.title}</div>
                <div class={"actions"}>{slots.actions?.()}</div>
              </div>
            ),
            ...slots,
          }}>
          {slots.default?.()}
        </Modal>
      );
    };
  },
});
