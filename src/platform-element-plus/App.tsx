import { defineComponent } from "vue";
import { FormRulePrefixMap, ProConfig, ProTheme, TMeta } from "@vue-start/pro";
import { elementMap, formElementMap } from "./component";
import { RouterView } from "vue-router";
import { convertRouter } from "@/router";
import { proStore } from "@/store/StoreCurrent";
import { ElMessage } from "element-plus";
import { Global, createAtom } from "@vue-start/css";
import { IRequestActor } from "@vue-start/request";
import { createCssVar } from "@/style/theme";

const showMsg = (opts: any) => {
  ElMessage({ type: opts.type, message: opts.message });
};

export const App = defineComponent(() => {
  const { clsObj } = createAtom();

  const registerActors: { actor: IRequestActor }[] = [
    {
      actor: {
        name: "dict",
        requestConfig: { method: "get", url: `/sys-dict` },
      },
    },
  ];

  const registerMetas: TMeta[] = [
    {
      actorName: "dict",
      storeName: (params) => `dict-${params!.type}`,
      convertData: (data) => {
        return data.data;
      },
    },
  ];

  return () => {
    return (
      <ProConfig
        elementMap={elementMap}
        formElementMap={formElementMap}
        formExtraMap={{ rulePrefixMap: FormRulePrefixMap }}
        registerStores={[proStore]}
        registerActors={registerActors}
        registerMetas={registerMetas}
        convertRouter={convertRouter}
        showMsg={showMsg}>
        <ProTheme createCssVar={createCssVar}>
          <Global styles={clsObj} />
          <RouterView />
        </ProTheme>
      </ProConfig>
    );
  };
});
