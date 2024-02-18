import { defineComponent } from "vue";

import GDemo from "./demo/global";
import Css from "./demo/css";
import Atom from "./demo/atom";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <GDemo />
        <Css />
        <Atom />
      </>
    );
  };
});
