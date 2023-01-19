import { defineComponent } from "vue";
import { ProPage } from "@vue-start/element-pro";
import Basic from "./component/basic";
import FieldChange from "./component/field-change";
import Readonly from "./component/readonly";
import HighState from "./component/high-state";
import Layout from "./component/layout";

export default defineComponent(() => {
  return () => {
    return (
      <ProPage>
        <Basic />
        <FieldChange />
        <Readonly />
        <HighState />
        <Layout />
      </ProPage>
    );
  };
});
