import { defineComponent } from "vue";
import Basic from "./demo/basic";
import Drawer from "./demo/drawer";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Drawer />
      </>
    );
  };
});
