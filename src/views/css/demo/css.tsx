/*---
title: css 属性
---*/
import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const fs = ref(22);

  const operateItems = [
    { value: "1", label: "字号+", onClick: () => fs.value++ },
    { value: "2", label: "字号-", onClick: () => fs.value-- },
  ];

  return () => {
    return (
      <>
        <pro-operate items={operateItems} />
        <div css={{ color: "red", fontSize: fs.value }}>content</div>
      </>
    );
  };
});
