import { defineComponent } from "vue";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";
import { useCheng } from "./Cheng";
import { map } from "lodash";
import { Elements } from "./element/Elements";
import { Modules } from "./module/Modules";
import { TTab } from "./types";

export const Overview = defineComponent({
  props: {},
  setup: () => {
    const { tabRef } = useCheng();

    const options = [{ value: "element" }, { value: "module" }];

    const handleTabClick = (tab: TTab) => {
      if (tabRef.value && tabRef.value === tab) {
        tabRef.value = undefined;
        return;
      }
      tabRef.value = tab;
    };

    const getComp = useGetCompByKey();
    const Button = getComp(ElementKeys.ButtonKey);

    return () => {
      return (
        <div>
          {map(options, ({ value }) => {
            return (
              <Button
                type={value === tabRef.value ? "primary" : undefined}
                onClick={() => handleTabClick(value as TTab)}>
                {value}
              </Button>
            );
          })}
          {tabRef.value === "element" && <Elements />}
          {tabRef.value === "module" && <Modules />}
        </div>
      );
    };
  },
});
