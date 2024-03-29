import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Extra from "./demo/extra";
import El from "./demo/el";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Extra />
        <El />
      </>
    );
  };
});
