import { defineComponent } from "vue";
import { LogonUser, ProConfig, useLogonUser } from "@vue-start/pro";
import { elementMap, formElementMap } from "./component";
import { RouterView } from "vue-router";
import { useEffect } from "@vue-start/hooks";
import { menus } from "./menus";

import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";

const SetMenu = defineComponent(() => {
  const { setPer } = useLogonUser();

  useEffect(() => {
    setPer({ menus });
  }, []);

  return () => {
    return null;
  };
});

export const App = defineComponent(() => {
  return () => {
    return (
      <LogonUser>
        <ProConfig elementMap={elementMap} formElementMap={formElementMap}>
          <ConfigProvider locale={zhCN}>
            <RouterView />
            <SetMenu />
          </ConfigProvider>
        </ProConfig>
      </LogonUser>
    );
  };
});
