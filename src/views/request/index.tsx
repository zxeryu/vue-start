import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Extra from "./demo/extra";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Extra />
      </>
    );
  };
});
