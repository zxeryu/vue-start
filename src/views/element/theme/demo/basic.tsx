/*---
title: 局部使用
---*/

import { computed, defineComponent, reactive } from "vue";
import { ProTheme } from "@vue-start/pro";
import { createCssVar } from "@/style/theme";

export default defineComponent(() => {
  const formSate = reactive<{ color: string }>({
    color: "#ff0000",
  });
  const columns = [{ title: "主题色", dataIndex: "color", valueType: "color" }];

  const tt = computed(() => {
    return { color: { primary: formSate.color } };
  });

  return () => {
    return (
      <ProTheme global={false} themeToken={tt.value} createCssVar={createCssVar}>
        <pro-form model={formSate} columns={columns} />
        <pro-button type={"primary"}>button</pro-button>
      </ProTheme>
    );
  };
});
