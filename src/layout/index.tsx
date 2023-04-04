import { defineComponent } from "vue";
import { Header } from "@/layout/Header";
import { RouterView, useRoute, useRouter } from "vue-router";
import { map } from "lodash";
import { css } from "@emotion/css";
import { useEffect } from "@vue-start/hooks";
import { useLogonUser } from "@vue-start/pro";

export const BasicLayout = defineComponent(() => {
  const { per } = useLogonUser();

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
        <div class={css({ display: "flex", height: "calc(100vh - var(--header-hei) - var(--divide-vertical-hei))" })}>
          <div
            class={css({
              height: "calc(100vh - var(--header-hei) - var(--divide-vertical-hei))",
              overflowY: "auto",
              borderRight: "1px solid #f0f0f0",
              color: "#606266",
              lineHeight: "36px",
              width: 200,
              minWidth: 200,
              ".item": {
                paddingLeft: 16,
                cursor: "pointer",
              },
            })}>
            {map(per.menus, (item) => {
              if (!item.children && item.name) {
                return (
                  <div
                    class={`item ${css({
                      color: item.name === route.name ? "var(--pro-color-primary)" : undefined,
                    })}`}
                    onClick={() => handleClick(item)}>
                    {item.title}
                  </div>
                );
              }
              return (
                <div>
                  <div class={css({ fontSize: 12, color: "#999", paddingLeft: 16 })}>{item.title}</div>
                  {map(item.children, (subItem) => {
                    return (
                      <div
                        class={`item ${css({
                          color: subItem.name === route.name ? "var(--pro-color-primary)" : undefined,
                        })}`}
                        onClick={() => handleClick(subItem)}>
                        {subItem.title}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <section class={css({ display: "flex", flexGrow: 1, justifyContent: "center" })}>
            <RouterView />
          </section>
        </div>
      </main>
    );
  };
});
