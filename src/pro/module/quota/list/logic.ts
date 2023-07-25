import { defineComponent } from "vue";
import { useModuleEvent } from "@vue-start/pro";

export default defineComponent(() => {
  useModuleEvent((action) => {
    console.log("###", action);
  });

  return () => null;
});
