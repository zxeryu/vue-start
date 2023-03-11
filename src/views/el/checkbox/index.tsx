import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Button from "./demo/button";
import Slot from "./demo/slot";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Button />
        <Slot />
      </>
    );
  };
});
