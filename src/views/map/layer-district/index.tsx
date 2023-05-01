import { defineComponent } from "vue";

import World from "./demo/world";
import Country from "./demo/country";
import Province from "./demo/province";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <World />
        <Country />
        <Province />
      </>
    );
  };
});
