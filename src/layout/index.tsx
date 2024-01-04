import { defineComponent, ref } from "vue";
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
    { label: "horizontal-v", value: "horizontal-v" },
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

  const collapseRef = ref(false);

  const handleCollapse = () => {
    collapseRef.value = !collapseRef.value;
  };

  // element-plus 中 collapse模式 使用
  const elCollapseSlots = {
    "menu-default": (menu: any) => {
      return <span>icon</span>;
    },
    "menu-title": (menu: any) => {
      if (menu.children && menu.children.length > 0) {
        return (
          <>
            <i>sub</i>
            <span>{menu.label}</span>
          </>
        );
      }
      return <span>{menu.label}</span>;
    },
  };

  // ant-design-vue 中 collapse模式 使用
  const antCollapseSlots = {
    "menu-icon": (menu: any) => {
      if (menu.children && menu.children.length > 0) {
        return <span>sub</span>;
      }
      return <span>icon</span>;
    },
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
        menuProps={{
          class: collapseRef.value ? "pro-layout-menus mini" : "pro-layout-menus",
          collapse: collapseRef.value, //el
          inlineCollapsed: collapseRef.value, //ant
        }}
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
          "menu-start": () => <div class={css({ lineHeight: "30px" })}>start</div>,
          "menu-end": () => (
            <div class={css({ lineHeight: "30px", textAlign: "center" })} onClick={handleCollapse}>
              {collapseRef.value ? "展开" : "合并"}
            </div>
          ),
        }}>
        <RouterView />
      </ProLayout>
    );
  };
});
