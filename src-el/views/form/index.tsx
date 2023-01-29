/*---
md: src-el/views/form/FORM.md
---*/
import { defineComponent } from "vue";
import Basic from "./demo/basic";
import FieldChange from "./demo/field-change";
import Readonly from "./demo/readonly";
import HighState from "./demo/high-state";
import Layout from "./demo/layout";


export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <FieldChange />
        <Readonly />
        <HighState />
        <Layout />
      </>
    );
  };
});
