import { computed, defineComponent, ExtractPropTypes, PropType, provide, reactive, ref } from "vue";
import { IElement, IElementGroup, IPage } from "./types";
import { filter, reduce } from "lodash";
import configData from "./comp/config.json";
import { IElementConfig } from "../../pro";
import { IChengProvide, IChengState, ISetOpts, ProChengKey } from "./ctx";
import { Header } from "./header";
import { Elements } from "./comp/Elements";
import { Ope } from "./ope";
import { ElementSet } from "./set";
import { DataTree } from "./comp/DataTree";

const chengProps = () => ({
  //组件描述
  groupElements: { type: Array as PropType<(IElement | IElementGroup)[]> },
  //
  setOpts: { type: Object as PropType<ISetOpts> },
  //模式 basic | screen
  mode: { type: String, default: "basic" },
});

export type MapProps = Partial<ExtractPropTypes<ReturnType<typeof chengProps>>>;

export const ProCheng = defineComponent<MapProps>({
  props: {
    ...chengProps(),
  } as any,
  setup: (props, { slots }) => {
    const chengState = reactive<IChengState>({
      showElements: true,
      showTree: true,
      showSet: true,
    });
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
    });

    const cls = computed(() => {
      const arr = ["pro-cheng", props.mode];
      if (chengState.showElements) arr.push("has-elements");
      if (chengState.showTree) arr.push("has-tree");
      if (chengState.showSet) arr.push("has-set");
      return arr;
    });

    return () => {
      return (
        <div class={cls.value}>
          <Header />
          <div class={"pro-cheng-layout"}>
            {chengState.showElements && <Elements />}
            {chengState.showTree && <DataTree />}
            <Ope />
            {chengState.showSet && <ElementSet />}
          </div>
        </div>
      );
    };
  },
});
