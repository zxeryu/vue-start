import { defineComponent } from "vue";
import { useCheng } from "../ctx";
import { isArray, map } from "lodash";
import { IElement } from "../types";
import { ElementKeys, IElementConfig, useGetCompByKey } from "@vue-start/pro";
import { generateId } from "@vue-start/hooks";

export const Elements = defineComponent<{
  onSelect?: (el: IElement) => void;
}>({
  props: {} as any,
  setup: (_, { emit }) => {
    const { groupElements, pageRef } = useCheng();

    const handleClick = (element: IElement) => {
      const newElement: IElementConfig = {
        elementType: element.elementType,
        elementId: `${element.elementType}-${generateId()}`,
        elementProps: {},
      };

      // emit("select", element);
      const elementConfigs = pageRef?.value?.configData?.elementConfigs;
      if (isArray(elementConfigs)) {
        elementConfigs.push(newElement);
      } else if (elementConfigs) {
        elementConfigs.children!.push(newElement);
      }
    };

    const getComp = useGetCompByKey();
    const Button = getComp(ElementKeys.ButtonKey);
    const Scroll = getComp(ElementKeys.ScrollKey);

    return () => {
      if (!Button) return null;

      return (
        <Scroll class={"pro-cheng-elements"}>
          <div class={"pro-cheng-elements-wrap"}>
            {map(groupElements, (item: IElement) => {
              if ((item as any).title) {
                return <div class={"group"}>{(item as any).title}</div>;
              }
              return (
                <div class={"item"} onClick={() => handleClick(item)}>
                  {item.name}
                </div>
              );
            })}
          </div>
        </Scroll>
      );
    };
  },
});
