import { defineComponent } from "vue";
import { ISetPropItem } from "../types";
import { useCheng } from "../ctx";
import { ItemSet } from "./item";

export const ClassSet = defineComponent({
  props: {} as any,
  setup: () => {
    const { setOpts } = useCheng();

    const item: ISetPropItem = {
      name: "class",
      elementType: "select",
      options: setOpts.clsNames || [],
      inputProps: { multiple: true, style: "width:100%;" },
    };

    return () => {
      return <ItemSet item={item} />;
    };
  },
});
