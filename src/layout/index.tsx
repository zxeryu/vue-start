import { defineComponent } from "vue";
import { Header } from "@/layout/Header";
import { RouterView, useRouter } from "vue-router";
import { css } from "@emotion/css";
import { useEffect } from "@vue-start/hooks";
import { LeftMenu } from "@/layout/Menu";

export const BasicLayout = defineComponent(() => {
  const router = useRouter();

  useEffect(() => {
    if (location.pathname === "/") {
      router.replace({ name: "OverviewIndexMd" });
    }
  }, []);

  return () => {
    return (
      <main>
        <Header />
        <div style="height:var(--divide-vertical-hei)" />
        <div class={css({ display: "flex", height: "calc(100vh - var(--header-hei) - var(--divide-vertical-hei))" })}>
          <LeftMenu />
          <section class={css({ display: "flex", flexGrow: 1, justifyContent: "center" })}>
            <RouterView />
          </section>
        </div>
      </main>
    );
  };
});
