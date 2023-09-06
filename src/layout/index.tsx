import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { findTreeItem, useEffect } from "@vue-start/hooks";
import { ProLayout, useProRouter } from "@vue-start/pro";
import { find } from "lodash";
import { HeaderLeft, HeaderRight } from "@/layout/Header";
import { css } from "@emotion/css";
import { routes } from "@/router/routes";
import { menus } from "@/common/menus";
import { useConfigStore } from "@/store/StoreCurrent";

export const BasicLayout = defineComponent(() => {
  const { router } = useProRouter();

  const [config, setConfig] = useConfigStore();

  const layoutOptions = [
    { label: "compose", value: "compose" },
    { label: "vertical", value: "vertical" },
    { label: "horizontal", value: "horizontal" },
  ];

  const handleLayoutChange = (v: string) => {
    setConfig({ layout: v });
  };

  useEffect(() => {
    if (location.pathname === "/") {
      router.replace({ name: "OverviewIndexMd" });
    }
  }, []);

  const findCurrentTopName = (route: any, menuTopMap: any) => {
    const list = findTreeItem(routes, (item) => item.name === route.name).list;
    if (list) {
      const index = find(list, (item) => {
        //根据当前项目的规则制定
        return item.path === "index" || item.path === "base";
      });
      if (index) return menuTopMap[index.name];
    }
  };

  const findActiveKey = (route: any) => {
    const list = findTreeItem(routes, (item) => item.name === route.name).list;
    if (list) {
      const index = find(list, (item) => {
        //根据当前项目的规则制定
        return item.path === "index" || item.path === "base";
      });
      if (index) return index.name;
    }
  };

  const onMenuItemClick = (item: any) => {
    router.openMenu(item);
  };

  return () => {
    return (
      <ProLayout
        class={css({
          ".el-menu--horizontal": {
            borderBottom: "unset",
          },
        })}
        layout={config.layout as any}
        menus={menus}
        fieldNames={{ value: "name", label: "title", children: "children" }}
        findCurrentTopName={findCurrentTopName}
        findActiveKey={findActiveKey}
        // @ts-ignore
        onMenuItemClick={onMenuItemClick}
        v-slots={{
          "header-start": () => <HeaderLeft />,
          "header-end": () => (
            <>
              <HeaderRight />
              <pro-select
                class={css({ width: 120, marginLeft: 16 })}
                value={config.layout}
                modelValue={config.layout}
                options={layoutOptions}
                onChange={handleLayoutChange}
              />
            </>
          ),
          "menu-start": () => <div>start</div>,
          "menu-end": () => <div>end</div>,
        }}>
        <RouterView />
      </ProLayout>
    );
  };
});
