import { defineComponent } from "vue";
import { ProLayout } from "@vue-start/pro";
import { css } from "@emotion/css";

export const BasicLayout = defineComponent(() => {
  const menus = [
    { label: "设计", value: "design" },
    { label: "预览", value: "preview" },
  ];

  return () => {
    return (
      <ProLayout
        layout={"compose"}
        menus={menus}
        v-slots={{
          "header-start": () => <div class={css({ color: "black", paddingLeft: 16 })}>Cheng</div>,
          "header-end": () => <div>end</div>,
        }}>
        <router-view />
      </ProLayout>
    );
  };
});
