/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";
import { options } from "@/common/columns";

export default defineComponent(() => {
  const valueRef = ref("man");

  return () => {
    return <pro-tabs v-model:modelValue={valueRef.value} options={options} />;
  };
});
