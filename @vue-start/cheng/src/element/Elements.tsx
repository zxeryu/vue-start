import { computed, defineComponent } from "vue";
import { useCheng } from "../Cheng";
import { groupBy, map } from "lodash";
import { IElement } from "../types";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";

export const Elements = defineComponent({
  props: {},
  setup: (_, { emit }) => {
    const { elements } = useCheng();

    const groupData = computed(() => groupBy(elements, (item) => item.group));

    const handleClick = (element: IElement) => {
      emit("select", element);
    };

    const getComp = useGetCompByKey();
    const Button = getComp(ElementKeys.ButtonKey);

    return () => {
      if (!Button) return null;

      return (
        <div class={"cheng-elements"}>
          {map(groupData.value, (list, group) => {
            return (
              <>
                <div class={"cheng-elements-group"}>{group || "其他"}</div>
                {map(list, (item) => {
                  return (
                    <Button class={"cheng-elements-btn"} onClick={() => handleClick(item)}>
                      {item.name}
                    </Button>
                  );
                })}
              </>
            );
          })}
        </div>
      );
    };
  },
});
