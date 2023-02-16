import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Sign from "./demo/sign";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Sign />
      </>
    );
  };
});
