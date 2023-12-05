/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";

export default defineComponent(() => {
  const valueRef = ref([]);

  return () => {
    console.log("file", valueRef.value);

    return <pro-digit-range v-model={valueRef.value} v-model:value={valueRef.value} />;
  };
});
