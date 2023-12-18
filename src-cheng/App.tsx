import "./component/init-props";
import { defineComponent } from "vue";
import { FormRulePrefixMap, ProConfig } from "@vue-start/pro";
import { elementMap, formElementMap } from "./component";
import { RouterView } from "vue-router";
import { convertRouter } from "./route";

export const App = defineComponent(() => {
  return () => {
    return (
      <ProConfig
        elementMap={elementMap}
        formElementMap={formElementMap}
        formExtraMap={{
          rulePrefixMap: FormRulePrefixMap,
        }}
        convertRouter={convertRouter}>
        <RouterView />
      </ProConfig>
    );
  };
});
