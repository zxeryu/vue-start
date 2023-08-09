import { defineComponent, inject, provide, ref, Ref } from "vue";
import { IElement, IModule, TTab } from "./types";

export interface IChengProvide {
  //基础组件
  elements: IElement[];
  //当前选中的tab
  tabRef: Ref<TTab | undefined>;
  //当前操作的组件对象
  elementRef?: Ref<IElement | undefined>;
  //当前操作的Module
  moduleRef?: Ref<IModule | undefined>;
}

const ProChengKey = Symbol("cheng");

export const useCheng = () => inject(ProChengKey) as IChengProvide;

export const ProCheng = defineComponent({
  props: {
    elements: Array,
  },
  setup: (props, { slots }) => {
    const tabRef = ref<TTab>();

    const elementRef = ref<IElement>();
    const moduleRef = ref<IElement>();

    provide(ProChengKey, { elements: props.elements, tabRef, elementRef, moduleRef });

    return () => {
      return <>{slots.default?.()}</>;
    };
  },
});
