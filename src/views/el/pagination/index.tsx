import { defineComponent } from "vue";

import Basic from "./demo/basic";
import ComposeChange from "./demo/compose-change";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <ComposeChange />
      </>
    );
  };
});
