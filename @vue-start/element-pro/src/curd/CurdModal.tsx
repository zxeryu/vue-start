import { defineComponent } from "vue";
import { ElDialog } from "element-plus";
import { useProCurdModule } from "./ctx";
import { CurdCurrentMode } from "./CurdModule";
import { get, omit } from "lodash";
import { ProCurdFormConnect } from "./CurdForm";
import { setReactiveValue } from "@vue-start/hooks";

export interface ModalProps {
  appendToBody?: boolean;
  beforeClose?: (done: () => void) => void;
  destroyOnClose?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  lockScroll?: boolean;
  modal?: boolean;
  openDelay?: number;
  closeDelay?: number;
  top?: string;
  modelValue?: boolean;
  modalClass?: string;
  width?: string | number;
  zIndex?: number;
  trapFocus?: boolean;
  center?: boolean;
  customClass?: string;
  draggable?: boolean;
  fullscreen?: boolean;
  showClose?: boolean;
  title?: string;
}

export const ProCurdModal = defineComponent<ModalProps>({
  props: {
    ...ElDialog.props,
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
      curdState.addAction = undefined;
    };

    return () => {
      return (
        <ElDialog
          destroyOnClose
          title={getTitle()}
          //如果当前有操作模式，打开Modal
          modelValue={!!curdState.mode}
          onClose={handleCancel}
          {...(props as any)}
          v-slots={omit(slots, "default")}>
          {curdState.detailLoading ? <div class={"pro-curd-modal-spin"} v-loading={true} /> : slots.default?.()}
        </ElDialog>
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
