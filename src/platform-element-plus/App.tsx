import { defineComponent } from "vue";
import { FormRulePrefixMap, ProConfig } from "@vue-start/pro";
import { elementMap, formElementMap } from "./component";
import { RouterView } from "vue-router";
import { convertRouter } from "@/router";
import { proStore } from "@/store/StoreCurrent";
import { ElMessage } from "element-plus";
import { Global, createAtom } from "@vue-start/css";
import { ChengOpe } from "@/layout/cheng";


const showMsg = (opts: any) => {
  ElMessage({ type: opts.type, message: opts.message });
};

export const App = defineComponent(() => {
  const { clsObj } = createAtom();
  return () => {
    return (
      <ProConfig
        elementMap={elementMap}
        formElementMap={formElementMap}
        formExtraMap={{ rulePrefixMap: FormRulePrefixMap }}
        registerStores={[proStore]}
        convertRouter={convertRouter}
        showMsg={showMsg}>
        <Global styles={clsObj} />
        <RouterView />
        <ChengOpe />
      </ProConfig>
    );
  };
});
