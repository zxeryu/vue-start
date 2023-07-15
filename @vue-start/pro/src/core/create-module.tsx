import { defineComponent, ref } from "vue";
import { ProModule } from "./Module";
import { IElementConfig } from "./core";
import { ElementKeys, useGetCompByKey } from "../comp";
import { useEffect } from "@vue-start/hooks";

export const createModule = ({ loader }: { loader?: () => Promise<{ default: IElementConfig[] }> }) => {
  return defineComponent({
    props: {},
    setup: () => {
      const configRef = ref<IElementConfig[]>();

      //加载config：网络 或者 loader
      useEffect(() => {
        if (loader) {
          loader().then((res) => {
            if (res && res.default) {
              configRef.value = res.default;
            }
          });
          return;
        }
      }, []);

      const getComp = useGetCompByKey();
      const ProLoading = getComp(ElementKeys.LoadingKey);

      return () => {
        if (!configRef.value) {
          if (!ProLoading) return null;
          return (
            <ProLoading loading>
              <div class={"pro-module-loading-dom"} />
            </ProLoading>
          );
        }

        return <ProModule elementConfigs={configRef.value} />;
      };
    },
  });
};
