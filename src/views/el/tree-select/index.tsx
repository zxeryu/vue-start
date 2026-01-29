import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Value from "./demo/value";
import Compose from "./demo/compose";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Value />
        <Compose />
      </>
    );
  };
});
