import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Slot from "./demo/slot";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Slot />
      </>
    );
  };
});
