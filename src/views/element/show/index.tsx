import { defineComponent } from "vue";

import Text from "./demo/text";
import Digit from "./demo/digit";
import Options from "./demo/options";
import Tree from "./demo/tree";
import Date from "./demo/date";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Text />
        <Digit />
        <Options />
        <Tree />
        <Date />
      </>
    );
  };
});
