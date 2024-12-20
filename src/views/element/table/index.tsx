import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Operate from "./demo/operate";
import Extra from "./demo/extra";
import Slots from "./demo/slots";
import Group from "./demo/group";
import Header from "./demo/header";
import Merge from "./demo/merge";
import Selection from "./demo/selection";
import Selection2 from "./demo/selection2";

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
        <Selection />
        <Selection2 />
      </>
    );
  };
});
