import { computed, defineComponent, reactive } from "vue";
import { useCheng } from "../Cheng";
import { useWatch } from "@vue-start/hooks";
import { useGetCompByKey } from "@vue-start/pro";
import { map } from "lodash";
import { JsonSetDom } from "./json";
import { ItemSet } from "./item";
import { ClassSet } from "./style";

export const ElementSet = defineComponent({
  props: {} as any,
  setup: () => {
    const { elementRef, elementsMap } = useCheng();

    const TabOptions = [
      { label: "属性", value: "prop" },
      { label: "样式", value: "style" },
    ];

    const state = reactive<{
      tab: "prop" | "style" | string;
    }>({ tab: TabOptions[0].value });

    const setProps = computed(() => {
      if (!elementRef.value) return [];
      const element = elementsMap[elementRef.value.elementType];
      return element?.setProps || [];
    });

    useWatch(
      () => {
        //保存操作
      },
      elementRef,
      { deep: true },
    );

    const getComp = useGetCompByKey();
    const Tabs = getComp("Tabs$");

    return () => {
      if (!elementRef.value) {
        return null;
      }
      return (
        <div class={"cheng-element-set"}>
          <Tabs v-model={state.tab} options={TabOptions} />
          <JsonSetDom target={elementRef.value!.elementProps} />

          {state.tab === "prop" && (
            <>
              {map(setProps.value, (item) => {
                return <ItemSet item={item} />;
              })}
            </>
          )}
          {state.tab === "style" && (
            <>
              <ClassSet />
            </>
          )}
        </div>
      );
    };
  },
});
