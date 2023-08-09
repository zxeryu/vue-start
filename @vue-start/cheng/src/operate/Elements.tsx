import { defineComponent } from "vue";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";
import { IElement } from "../types";
import { useOperator } from "./Operator";
import { Elements } from "../element/Elements";

export const ElementsModal = defineComponent(() => {
  const { addElVisibleRef, addElement } = useOperator();

  const handleSelect = (el: IElement) => {
    addElement(el);
    addElVisibleRef.value = false;
  };

  const getComp = useGetCompByKey();
  const Modal = getComp(ElementKeys.ModalKey);

  return () => {
    if (!Modal) return null;

    if (!addElVisibleRef.value) return null;

    return (
      <Modal
        visible
        title={"选择组件"}
        width={800}
        footer={false}
        onCancel={() => {
          addElVisibleRef.value = false;
        }}>
        <Elements
          // @ts-ignore
          onSelect={handleSelect}
        />
      </Modal>
    );
  };
});
