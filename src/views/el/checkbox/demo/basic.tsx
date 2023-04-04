/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";
import { options } from "@/common/columns";

export default defineComponent(() => {
  const valueRef = ref();

  return () => {
    return <pro-checkbox v-model={valueRef.value} options={options} />;
  };
});
