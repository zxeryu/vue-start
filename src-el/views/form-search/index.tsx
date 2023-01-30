import { defineComponent } from "vue";

import Basic from "./demo/basic";
import Manual from "./demo/manual";
import Layout from "./demo/layout";

export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <Manual />
        <Layout />
      </>
    );
  };
});
