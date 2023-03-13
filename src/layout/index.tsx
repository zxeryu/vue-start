import { defineComponent } from "vue";
import { Header } from "@/layout/Header";
import { RouterView, useRoute, useRouter } from "vue-router";
import { map } from "lodash";
import { css } from "@emotion/css";
import { useEffect } from "@vue-start/hooks";

const menus = [
  { title: "综述", name: "OverviewIndexMd" },
  { title: "demo公共数据", name: "ColumnIndexMd" },
  { title: "@vue-start/request", name: "RequestIndex" },
  { title: "@vue-start/store", name: "StoreIndexMd" },
  { title: "@vue-start/config", name: "ConfigIndex" },
  {
    title: "@vue-start/hooks",
    name: "Hooks",
    children: [
      { title: "useEffect", name: "HooksEffectIndexMd" },
      { title: "其他hooks", name: "HooksChildrenIndexMd" },
      { title: "工具方法", name: "HooksUtilIndexMd" },
    ],
  },
  {
    title: "@vue-start/element-pro",
    children: [
      { title: "Checkbox", name: "ElCheckboxIndex" },
      { title: "Loading", name: "ElLoadingIndex" },
      { title: "Modal", name: "ElModalIndex" },
      { title: "Pagination", name: "ElPaginationIndex" },
      { title: "Radio", name: "ElRadioIndex" },
      { title: "Select", name: "ElSelectIndex" },
      { title: "Tabs", name: "ElTabsIndex" },
    ],
  },
  {
    title: "@vue-start/pro",
    children: [
      { title: "Form", name: "ElementFormIndex" },
      { title: "SearchForm", name: "ElementFormSearchIndex" },
      { title: "Table", name: "ElementTableIndex" },
      { title: "Operate", name: "ElementOperateIndex" },
      { title: "List", name: "ElementListIndex" },
      { title: "Desc", name: "ElementDescIndex" },
      { title: "Page", name: "ElementPageIndex" },
    ],
  },
  {
    title: "curd",
    children: [
      { title: "Curd", name: "CurdCurdIndex" },
      { title: "CurdForm", name: "CurdFormIndex" },
      { title: "CurdModal", name: "CurdModalIndex" },
      { title: "CurdDesc", name: "CurdDescIndex" },
    ],
  },
];

export const BasicLayout = defineComponent(() => {
  const router = useRouter();
  const route = useRoute();

  useEffect(() => {
    if (location.pathname === "/") {
      router.replace({ name: "OverviewIndexMd" });
    }
  }, []);

  const handleClick = (item: { name: string }) => {
    router.push({ name: item.name });
  };

  return () => {
    return (
      <main>
        <Header />
        <div style="height:var(--divide-vertical-hei)" />
        <div class="flex" style="height: calc(100vh - var(--header-hei) - var(--divide-vertical-hei))">
          <el-scrollbar
            class={css({
              borderRight: "1px solid #f0f0f0",
              ".el-menu": {
                width: 290,
                borderRight: "none",
              },
              ".el-menu-item": {
                height: 48,
              },
            })}
            height={"calc(100vh - var(--header-hei) - var(--divide-vertical-hei))"}>
            <el-menu default-active={route.name}>
              {map(menus, (group) => {
                if (!group.children && group.name) {
                  return (
                    <el-menu-item index={group.name} onClick={() => handleClick(group)}>
                      {group.title}
                    </el-menu-item>
                  );
                }
                return (
                  <el-menu-item-group title={group.title}>
                    {map(group.children, (item) => {
                      return (
                        <el-menu-item index={item.name} onClick={() => handleClick(item)}>
                          {item.title}
                        </el-menu-item>
                      );
                    })}
                  </el-menu-item-group>
                );
              })}
            </el-menu>
          </el-scrollbar>
          <section class="flex flex-1 justify-center">
            <RouterView />
          </section>
        </div>
      </main>
    );
  };
});
