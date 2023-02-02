import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Modal from "./demo/modal";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Modal />
      </>
    );
  };
});
