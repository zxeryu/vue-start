import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Dynamic from "./demo/dynamic";
import Line from "./demo/line";
import Geo from "./demo/geo";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Dynamic />
        <Line />
        <Geo />
      </>
    );
  };
});
