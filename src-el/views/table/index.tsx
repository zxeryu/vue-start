import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Operate from "./demo/operate";
import Extra from "./demo/extra";
import Slots from "./demo/slots";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Operate />
        <Extra />
        <Slots />
      </>
    );
  };
});
