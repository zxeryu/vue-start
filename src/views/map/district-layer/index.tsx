import { defineComponent } from "vue";

import Full from "./demo/full";
import Locked from "./demo/locked";

export default defineComponent(() => {
  return () => (
    <>
      <Full />
      <Locked />
    </>
  );
});