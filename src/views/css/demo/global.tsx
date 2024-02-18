/*---
title: Global 全局样式
---*/
import { defineComponent, ref } from "vue";
import { Global } from "@vue-start/css";

export default defineComponent(() => {
  const showVisible = ref(false);

  const operateItems = [
    { value: "1", label: "设置", onClick: () => (showVisible.value = true) },
    { value: "2", label: "取消", onClick: () => (showVisible.value = false) },
  ];

  return () => {
    return (
      <>
        <pro-operate items={operateItems} />
        {showVisible.value && (
          <Global
            styles={{
              body: { background: "pink" },
            }}
          />
        )}
      </>
    );
  };
});
