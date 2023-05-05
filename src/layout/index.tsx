import { defineComponent } from "vue";
import { RouterView, useRouter } from "vue-router";
import { findFirstValidMenu, findTreeItem, useEffect } from "@vue-start/hooks";
import { ProLayout } from "@vue-start/pro";
import { find, size } from "lodash";
import { HeaderLeft, HeaderRight } from "@/layout/Header";
import { css } from "@emotion/css";
import { routes } from "@/router/routes";
import { menus } from "@/common/menus";
import { useConfigStore } from "@/store/StoreCurrent";

export const BasicLayout = defineComponent(() => {
  const router = useRouter();

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
    if (size(item.children) > 0) {
      const first = findFirstValidMenu(item.children, (item) => !item.children || size(item.children) <= 0);
      if (first) {
        router.push({ name: first.value });
      }
      return;
    }
    router.push({ name: item.value });
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
        }}>
        <RouterView />
      </ProLayout>
    );
  };
});
