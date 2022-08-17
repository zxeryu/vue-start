import { defineComponent } from "vue";
import { ElDialog } from "element-plus";
import { get, omit } from "lodash";
import { ProCurdFormConnect } from "./CurdForm";
import { setReactiveValue } from "@vue-start/hooks";
import { CurdAction, useProCurd } from "@vue-start/pro";

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
    const { curdState, getOperate } = useProCurd();

    //根据当前模式展示不同的Title
    const getTitle = () => {
      switch (curdState.mode) {
        case CurdAction.ADD:
          return getOperate(CurdAction.ADD)?.label;
        case CurdAction.EDIT:
          return getOperate(CurdAction.EDIT)?.label;
        case CurdAction.DETAIL:
          return getOperate(CurdAction.DETAIL)?.label;
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
          v-slots={slots}
        />
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
