import { defineComponent } from "vue";
import { ProConfig } from "@vue-start/pro";
import { elementMap, formElementMap } from "./component";
import { RouterView } from "vue-router";

export const App = defineComponent(() => {
  return () => {
    return (
      <ProConfig elementMap={elementMap} formElementMap={formElementMap}>
        <RouterView />
      </ProConfig>
    );
  };
});
