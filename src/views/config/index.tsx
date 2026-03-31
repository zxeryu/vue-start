import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Global from "./demo/global";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Global />
      </>
    );
  };
});
