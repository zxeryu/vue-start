import { defineComponent } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { map } from "lodash";
import { useEffect } from "@vue-start/hooks";
import { ProConfig } from "@vue-start/pro";
import { elementMap, formElementMap } from "@el/component";

const Header = defineComponent(() => {
  const router = useRouter();
  const route = useRoute();

  const handleClick = (item: { name: string }) => {
    router.push({ name: item.name });
  };

  const menus = [
    { title: "form", name: "FormIndex" },
    { title: "search-form", name: "FormSearchIndex" },
    { title: "table", name: "TableIndex" },
    { title: "curd", name: "CurdIndex" },
  ];

  useEffect(() => {
    if (location.pathname === "/") {
      router.replace({ name: menus[0].name });
    }
  }, []);

  return () => {
    return (
      <header>
        <el-menu mode={"horizontal"} default-active={route.name}>
          <div
            style={
              "display: inline-flex;justify-content: center;align-items: center;border-bottom:6px solid transparent;padding:0 16px;font-weight:bold"
            }>
            element-plus
          </div>
          {map(menus, (item) => {
            return (
              <el-menu-item index={item.name} onClick={() => handleClick(item)}>
                {item.title}
              </el-menu-item>
            );
          })}
        </el-menu>
      </header>
    );
  };
});

export const App = defineComponent({
  props: {},
  setup: () => {
    return () => {
      return (
        <ProConfig elementMap={elementMap} formElementMap={formElementMap}>
          <main>
            <Header />
            <div style={"height:var(--divide-vertical-hei)"} />
            <RouterView />
          </main>
        </ProConfig>
      );
    };
  },
});
