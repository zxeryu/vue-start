import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Download from "./demo/download";
import List from "./demo/list";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Download />
        <List />
      </>
    );
  };
});
