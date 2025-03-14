import { defineComponent, Teleport } from "vue";
import { ProCheng } from "@vue-start/cheng";
import { useChengState } from "@/store/StoreCurrent";
import { Basics, Feedbacks, FormInputs, Layouts } from "../common/el";
import { createAtom } from "@vue-start/css";
import { map } from "lodash";

export const elements = [
  { title: "Basics" },
  ...Basics,
  { title: "Inputs" },
  ...FormInputs,
  { title: "Feedbacks" },
  ...Feedbacks,
  { title: "Layouts" },
  ...Layouts,
];

export const ChengOpe = defineComponent(() => {
  const [chengState, setChengState] = useChengState();
  const { clsList } = createAtom();
  const clsNames = map(clsList, (item) => item.name.replace(".", ""));

  return () => {
    return (
      <Teleport to={"body"}>
        <ProCheng groupElements={elements as any} setOpts={{ clsNames }} />
      </Teleport>
    );
  };
});
