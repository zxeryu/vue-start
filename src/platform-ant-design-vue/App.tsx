import { defineComponent } from "vue";
import { FormRulePrefixMap, ProConfig } from "@vue-start/pro";
import { elementMap, formElementMap } from "./component";
import { RouterView } from "vue-router";

import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { convertRouter } from "@/router";
import { proStore } from "@/store/StoreCurrent";

export const App = defineComponent(() => {
  return () => {
    return (
      <ProConfig
        elementMap={elementMap}
        formElementMap={formElementMap}
        formExtraMap={{ rulePrefixMap: FormRulePrefixMap }}
        registerStores={[proStore]}
        convertRouter={convertRouter}>
        <ConfigProvider locale={zhCN}>
          <RouterView />
        </ConfigProvider>
      </ProConfig>
    );
  };
});
