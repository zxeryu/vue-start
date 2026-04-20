import { defineComponent } from "vue";

import Single from "./demo/single";
import Multiple from "./demo/multiple";
import TriggerSlot from "./demo/trigger-slot";
import Compose from "./demo/compose";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Single />
        <Multiple />
        <TriggerSlot />
        <Compose />
      </>
    );
  };
});