import { defineComponent, inject, provide, ref, Ref, UnwrapRef } from "vue";
import { ElementsModal } from "./Elements";
import { IElement } from "../types";

export interface IOperatorProvide {
  addElVisibleRef: Ref<UnwrapRef<boolean>>;
  addElement: (el: IElement) => void;
}

const ProOperatorKey = Symbol("cheng-operator");

export const useOperator = () => inject(ProOperatorKey) as IOperatorProvide;

export const ProOperator = defineComponent({
  props: {},
  setup: (props, { slots }) => {
    /************************* 添加Element ***********************/
    const addElVisibleRef = ref(false);

    const addElement = (el: IElement) => {
      console.log(el);
    };

    provide(ProOperatorKey, {
      addElVisibleRef,
      addElement,
    });

    return () => {
      return (
        <div>
          <div
            onClick={() => {
              addElVisibleRef.value = true;
            }}>
            添加模拟
          </div>
          {slots.elements?.() || <ElementsModal />}
        </div>
      );
    };
  },
});
