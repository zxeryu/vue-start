import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Operate from "./demo/operate";
import Extra from "./demo/extra";
import Slots from "./demo/slots";
import Group from "./demo/group";
import Header from "./demo/header";
import Merge from "./demo/merge";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Operate />
        <Extra />
        <Slots />
        <Group />
        <Header />
        <Merge />
      </>
    );
  };
});
