import { defineComponent } from "vue";
import { LogonUser, ProConfig, useLogonUser } from "@vue-start/pro";
import { elementMap, formElementMap } from "./component";
import { RouterView } from "vue-router";
import { useEffect } from "@vue-start/hooks";
import { menus } from "./menus";

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
          <RouterView />
          <SetMenu />
        </ProConfig>
      </LogonUser>
    );
  };
});
