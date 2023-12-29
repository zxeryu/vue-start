import { defineComponent } from "vue";
import Basic from "./demo/basic";
import FieldChange from "./demo/field-change";
import Readonly from "./demo/readonly";
import HighState from "./demo/high-state";
import Layout from "./demo/layout";
import Slots from "./demo/slots";
import Debounce from "./demo/debounce";
import PreFinish from "./demo/pre-finish";
import FormList from "./demo/form-list";


export default defineComponent(() => {
  return () => {
    return (
      <>
        <Basic />
        <FieldChange />
        <Readonly />
        <HighState />
        <Layout />
        <Slots />
        <Debounce />
        <PreFinish />
        <FormList />
      </>
    );
  };
});
