import { defineComponent } from "vue";
import { Header } from "@/layout/Header";
import { RouterView, useRoute, useRouter } from "vue-router";
import { map } from "lodash";
import { css } from "@emotion/css";
import { useEffect } from "@vue-start/hooks";

const menus = [
  {
    title: "网络请求",
    children: [{ title: "基础", name: "RequestIndex" }],
  },
  {
    title: "状态",
    children: [{ title: "基础", name: "StoreIndex" }],
  },
  {
    title: "路由",
    children: [{ title: "生成", name: "RouteIndex" }],
  },
  {
    title: "pro-组件",
    children: [
      { title: "Operate", name: "ElementOperateIndex" },
      { title: "Grid", name: "ElementGridIndex" },
      { title: "Form", name: "ElementFormIndex" },
      { title: "SearchForm", name: "ElementFormSearchIndex" },
      { title: "Table", name: "ElementTableIndex" },
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
      router.replace({ name: "RequestIndex" });
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