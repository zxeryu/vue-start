import { defineComponent, Teleport } from "vue";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";
import { useCheng } from "./Cheng";
import { Elements } from "./comp/Elements";
import { DataTree } from "./comp/DataTree";
import { ElementSet } from "./set";

const Header = defineComponent({
  props: {} as any,
  setup: () => {
    const { onClose } = useCheng();

    const handleClose = () => onClose?.();

    const getComp = useGetCompByKey();
    const Button = getComp(ElementKeys.ButtonKey);

    return () => {
      return (
        <div class={"cheng-header"}>
          <Button onClick={handleClose}>退出</Button>
          Cheng Header
        </div>
      );
    };
  },
});

export const Overview = defineComponent({
  props: {} as any,
  setup: () => {
    return () => {
      return (
        <Teleport to={"body"}>
          <div class={"cheng"}>
            <Header />
            <div class={"cheng-layout"}>
              <Elements />
              <div class={"cheng-layout-center"}>
                <DataTree />
              </div>
              <ElementSet />
            </div>
          </div>
        </Teleport>
      );
    };
  },
});
