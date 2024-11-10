import { defineComponent } from "vue";
import { FormRulePrefixMap, ITheme, ProConfig, ProTheme, TMeta } from "@vue-start/pro";
import { elementMap, formElementMap } from "./component";
import { RouterView } from "vue-router";
import { convertRouter } from "@/router";
import { proStore } from "@/store/StoreCurrent";
import { ElMessage } from "element-plus";
import { Global, createAtom } from "@vue-start/css";
import { forEach, get } from "lodash";
import { IRequestActor } from "../../@vue-start/request";

const showMsg = (opts: any) => {
  ElMessage({ type: opts.type, message: opts.message });
};

export const App = defineComponent(() => {
  const { clsObj } = createAtom();

  const createCssVar = (theme: ITheme) => {
    const colors: Record<string, any> = {};
    forEach(theme.color, (v, k) => {
      if (k === "bg") {
        colors["--pro-color-bg"] = v;
        return;
      }
      if (k === "border") {
        colors["--pro-color-border"] = get(v, "base");
        colors["--pro-color-border-light"] = get(v, "light");
        return;
      }
      if (k === "text") {
        colors["--pro-color-text"] = get(v, "base");
        colors["--pro-color-text-regular"] = get(v, "regular");
        colors["--pro-color-text-secondary"] = get(v, "secondary");
        colors["--pro-color-text-placeholder"] = get(v, "placeholder");
        return;
      }
      colors[`--pro-color-${k}`] = get(v, "base");

      if (k !== "primary") return;
      //
      colors[`--el-color-${k}`] = get(v, "base");
      forEach(get(v, "light"), (sc, si) => {
        if (["3", "5", "7", "8", "9"].indexOf(si) > -1) {
          colors[`--el-color-${k}-light-${si}`] = sc;
          colors[`--pro-color-${k}-light-${si}`] = sc;
        }
      });
      colors[`--el-color-${k}-dark-2`] = get(v, ["dark", "2"]);
    });

    const nameMap = { radius: "radius", fontSize: "size", lineHeight: "line-height", shadow: "shadow" };

    const obj: Record<string, any> = {};

    forEach(nameMap, (v, k) => {
      forEach(get(theme, k), (sv, sk) => {
        if (sk === "base") {
          obj[`--pro-${v}`] = sv;
        } else {
          obj[`--pro-${v}-${sk}`] = sv;
        }
      });
    });

    const spacing: Record<string, any> = {};
    forEach(theme.spacing, (v, k) => {
      spacing[`--pro-spacing-${k}`] = v;
    });

    return { ...colors, ...obj, ...spacing };
  };

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
