import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { ElementKeys, useGetCompByKey } from "../comp";
import { ProCurd, ProCurdProps } from "./Curd";
import { keys, omit } from "lodash";
import { ProCurdListConnect, ProCurdListPageConnect, ProCurdModalFormConnect, ProCurdPageConnect } from "./comp";
import { ModalCurdOpe } from "./ModalCurd";

const proCurdModuleProps = () => ({
  listType: { type: String as PropType<"page" | "list" | "none">, default: "page" },
  modalType: { type: String as PropType<"page" | "modal"> },
});

export type ProCurdModuleProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdModuleProps>>> & ProCurdProps;

export const ProCurdModule = defineComponent<ProCurdModuleProps>({
  props: {
    ...ProCurd.props,
    ...proCurdModuleProps(),
  },
  setup: (props, { slots }) => {
    const getComp = useGetCompByKey();
    const Curd = getComp(ElementKeys.ProCurdKey);

    const invalidKeys = keys(proCurdModuleProps());

    return () => {
      const listType = props.listType;
      const modalType = props.modalType;

      return (
        <Curd {...omit(props, invalidKeys)}>
          {listType === "page" && <ProCurdListPageConnect />}
          {listType === "list" && <ProCurdListConnect />}

          {modalType === "page" && <ProCurdPageConnect />}
          {modalType === "modal" && <ProCurdModalFormConnect />}
          {(modalType === "page" || modalType === "modal") && <ModalCurdOpe />}

          {slots.default?.()}
        </Curd>
      );
    };
  },
});
