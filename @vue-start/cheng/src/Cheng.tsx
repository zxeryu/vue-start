import {
  defineComponent,
  ExtractPropTypes,
  inject,
  PropType,
  provide,
  reactive,
  ref,
  Ref,
  UnwrapNestedRefs,
} from "vue";
import { IElement, IElementGroup, IPage, TTab } from "./types";
import { filter, reduce } from "lodash";
import configData from "./comp/config.json";
import { IElementConfig } from "../../pro";

export interface IChengState {
  tab?: TTab;
}

export interface ISetOpts {
  clsNames: string[];
}

export interface IChengProvide {
  groupElements: (IElement | IElementGroup)[];
  //基础组件
  elements: IElement[];
  elementsMap: Record<string, IElement>;
  //设置相关的配置
  setOpts: ISetOpts;
  //当前操作的Page
  pageRef: Ref<IPage | undefined>;
  //当前Page中的Element
  elementRef: Ref<IElementConfig | undefined>;
  //
  chengState: UnwrapNestedRefs<IChengState>;
  //
  onClose: () => void;
}

const ProChengKey = Symbol("cheng");

export const useCheng = () => inject(ProChengKey) as IChengProvide;

const chengProps = () => ({
  //是否展示
  show: { type: Boolean },
  //关闭回掉
  onClose: { type: Function as PropType<IChengProvide["onClose"]> },
  //组件描述
  groupElements: { type: Array as PropType<(IElement | IElementGroup)[]> },
  //
  setOpts: { type: Object as PropType<ISetOpts> },
});

export type MapProps = Partial<ExtractPropTypes<ReturnType<typeof chengProps>>>;

export const ProCheng = defineComponent<MapProps>({
  props: {
    ...chengProps(),
  } as any,
  setup: (props, { slots }) => {
    const chengState = reactive<IChengState>({});
    const pageRef = ref<IPage>({
      path: "",
      configData: configData as any,
    });
    const elementRef = ref<IElementConfig>();

    const groupElements = props.groupElements;
    const elements = filter(groupElements, (item) => !(item as IElementGroup).title) as IElement[];
    const elementsMap = reduce(elements, (pair, item) => ({ ...pair, [item.elementType]: item }), {});

    provide<IChengProvide>(ProChengKey, {
      groupElements: groupElements!,
      elements,
      elementsMap,
      setOpts: props.setOpts! || {},
      pageRef: pageRef,
      elementRef: elementRef,
      chengState,
      onClose: props.onClose!,
    });

    return () => {
      if (!props.show) {
        return null;
      }
      return <>{slots.default?.()}</>;
    };
  },
});
